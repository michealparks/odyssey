<script lang="ts">
  import { Mesh, MeshStandardMaterial } from 'three'
  import { T } from '@threlte/core'
  import { usePrismaticJoint, RigidBody, Collider } from '@threlte/rapier'
  import { useGltf } from '@threlte/extras'
  import { addToBloom } from '../../lib/bloom'

  interface Props {
    rotation?: number
    switchState?: 0 | 1 | 2
    onEnter?: () => void
    onExit?: () => void
  }

  let { rotation = 0, switchState = 0, onEnter, onExit }: Props = $props()

  interface GLTFResult {
    nodes: {
      sphere: Mesh
      sphere_band: Mesh
    }
    materials: {
      Material: MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('./glb/ship.glb')

  const { rigidBodyA, rigidBodyB } = usePrismaticJoint(
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [0, -4]
  )

  const material = new MeshStandardMaterial({
    color: 0xff5722,
    emissive: 10,
  })

  const handleEnter = (event: any) => {
    if (event.targetRigidBody === $rigidBodyA) {
      onEnter?.()
      if (switchState === 1) {
        material.color.set(0x4caf50)
      }
    }
  }

  const handleExit = (event: any) => {
    if (event.targetRigidBody === $rigidBodyA) {
      onExit?.()
      if (switchState === 0) {
        material.color.set(0xffee58)
      }
    }
  }
</script>

<T.Group
  position.y={0.6}
  rotation.y={rotation}
>
  <RigidBody
    type="fixed"
    bind:rigidBody={$rigidBodyB}
  >
    <Collider
      shape="cuboid"
      args={[0, 0, 0]}
    />
  </RigidBody>
</T.Group>

<T.Group
  position.y={1.5}
  rotation.y={rotation}
>
  <RigidBody
    type="dynamic"
    enabledRotations={[false, false, false]}
    enabledTranslations={[true, false, true]}
    bind:rigidBody={$rigidBodyA}
  >
    <Collider
      mass={0.1}
      shape="cuboid"
      args={[0.5, 0.5, 0.5]}
    />

    {#if $gltf}
      <T.Mesh
        name="sphere"
        castShadow
        receiveShadow
        geometry={$gltf.nodes.sphere.geometry}
        material={$gltf.nodes.sphere.material}
        position.y={-0.5}
      />
      <T.Mesh
        name="sphere_band"
        castShadow
        receiveShadow
        geometry={$gltf.nodes.sphere_band.geometry}
        position.y={-0.5}
        {material}
        oncreate={(ref) => {
          addToBloom(ref)
        }}
      />
    {/if}
  </RigidBody>

  <Collider
    shape="ball"
    args={[0.2]}
    sensor
    onsensorenter={handleEnter}
    onsensorexit={handleExit}
  />
</T.Group>

<script lang='ts'>

import { T, useFrame } from '@threlte/core'
import { Collider } from '@threlte/rapier'
import { useGltf } from '@threlte/extras'
import { frame } from '../../stores/state'

interface GLTFResult {
  nodes: {
    sentry: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

let rotationY = 0

useFrame(() => {
  rotationY += 0.01
})

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

</script>

{#if $gltf}
  <T.Mesh
    name="sentry"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.sentry.geometry}
    material={$gltf.materials.Material}
    position.y={-0.29}
    rotation.y={rotationY}
    visible={$frame === 'level_2'}
  >
    <T.Group position={[-6.78, 0.2, 0]}>
      <Collider shape='ball' args={[0.5]} />

      <T.SpotLight
        castShadow
        color='red'
        intensity={60}
        angle={Math.PI / 4}
        penumbra={0.4}
        on:create={({ ref }) => ref.lookAt(0, 0, 0)}
      />
      
    </T.Group>
  </T.Mesh>
{/if}
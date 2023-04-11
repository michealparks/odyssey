<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf, Audio } from '@threlte/extras'
import { AutoColliders, Collider } from '@threlte/rapier'
import { level, frame, setFrame } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte'
import { tweened } from 'svelte/motion'
import Joint from '../joint.svelte';

interface GLTFResult {
  nodes: {
    floor_center: THREE.Mesh
    sentry: THREE.Mesh
    floor_center_rail_1: THREE.Mesh
    floor_center_rail_3: THREE.Mesh
    floor_center_rail_4: THREE.Mesh
    floor_center_rail_2: THREE.Mesh
    floor_center_rail_5: THREE.Mesh
    floor_center_rail_6: THREE.Mesh
    floor_center_rail_7: THREE.Mesh
    floor_center_rail_8: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

const handleInteract = ({ detail }: CustomEvent<string>) => {
  switch (detail) {
    case 'e': return setFrame('level_3')
    case 'f': return setFrame('level_1')
  }
}

let volume = tweened(0, { duration: 2000 })

$: {
  if ($level === 2) {
    volume.set(0.1)
  } else {
    volume.set(0)
  }
}

</script>

{#if $level === 2}
  <InteractionSensor
    shape='roundCylinder'
    position={[0, 0, 0]}
    args={[1, 1, 0]}
    options={['e', 'f']}
    labels={['up', 'down']}
    on:interact={handleInteract}
  />
{/if}

<Collider
  shape='roundCylinder'
  args={[0.1, 15, 0]}
  position={[0, -0.37, 0]}
/>

{#if $frame !== 'title'}
  <Audio
    loop
    autoplay
    src='/mp3/computer_battle.mp3'
    volume={$volume}
  />
{/if}

{#if $gltf}
  <T
    is={$gltf.nodes.floor_center}
    visible={$level > 1}
    receiveShadow
    position={[0, -0.29, 0]}
  />

  <AutoColliders
    shape='cuboid'
  >
    <T.Mesh
      name="sentry"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.sentry.geometry}
      material={$gltf.materials.Material}
      position={[0, -0.29, 0]}
      rotation={[0, -0.13, 0]}
    />
  </AutoColliders>

  <T
    name="floor_center_rail_1"
    is={$gltf.nodes.floor_center_rail_1}
    castShadow
    receiveShadow
    position={[2.59, -0.26, 0]}
  >
    <Joint />
  </T>
  <T.Mesh
    name="floor_center_rail_2"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_2.geometry}
    material={$gltf.materials.Material}
    position={[1.68, -0.26, -1.68]}
  >
    <Joint rotation={Math.PI / 4} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_3"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_3.geometry}
    material={$gltf.materials.Material}
    position={[0, -0.26, -2.59]}
  >
    <Joint rotation={Math.PI / 2} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_4"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_4.geometry}
    material={$gltf.materials.Material}
    position={[-1.83, -0.26, -1.83]}
  >
    <Joint rotation={3 * Math.PI / 4} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_5"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_5.geometry}
    material={$gltf.materials.Material}
    position={[-2.38, -0.26, 0]}
  >
    <Joint rotation={Math.PI} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_6"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_6.geometry}
    material={$gltf.materials.Material}
    position={[-1.83, -0.26, 1.83]}
  >
    <Joint rotation={5 * Math.PI / 4} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_7"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_7.geometry}
    material={$gltf.materials.Material}
    position={[0, -0.26, 2.38]}
  >
    <Joint rotation={3 * Math.PI / 2} />
  </T.Mesh>
  <T.Mesh
    name="floor_center_rail_8"
    castShadow
    receiveShadow
    geometry={$gltf.nodes.floor_center_rail_8.geometry}
    material={$gltf.materials.Material}
    position={[1.68, -0.26, 1.68]}
  >
    <Joint rotation={7 * Math.PI / 4} />
  </T.Mesh>
{/if}

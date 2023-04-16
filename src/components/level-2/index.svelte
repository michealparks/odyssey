<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf, Audio } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { level, frame, setFrame } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte'
import { tweened } from 'svelte/motion'
import Joint from './joint.svelte'
import Sentry from './sentry.svelte'

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
    // case 'f': return setFrame('level_1')
  }
}

let volume = tweened(0, { duration: 2000 })

$: {
  if ($level === 2) {
    volume.set(0.01)
  } else {
    volume.set(0)
  }
}

$: visible = $frame === 'level_2'

</script>

<Sentry {visible} />

<InteractionSensor
  shape='roundCylinder'
  args={[1, 1, 0]}
  options={['e', /* 'f' */]}
  labels={['up', /* 'down' */]}
  on:interact={handleInteract}
/>

<T.Group position.y={-0.37}>
  <Collider
    shape='roundCylinder'
    args={[0.1, 15, 0]}
  />
</T.Group>

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
    receiveShadow
    position.y={-0.29}
    {visible}
  />

  <T
    name="floor_center_rail_1"
    is={$gltf.nodes.floor_center_rail_1}
    castShadow
    receiveShadow
    position.x={2.59}
    position.y={-0.26}
    {visible}
  >
    <Joint />
  </T>
  <T
    name="floor_center_rail_2"
    is={$gltf.nodes.floor_center_rail_2}
    castShadow
    receiveShadow
    position={[1.68, -0.26, -1.68]}
    {visible}
  >
    <Joint rotation={Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_3"
    is={$gltf.nodes.floor_center_rail_3}
    castShadow
    receiveShadow
    position={[0, -0.26, -2.59]}
    {visible}
  >
    <Joint rotation={Math.PI / 2} />
  </T>
  <T
    name="floor_center_rail_4"
    is={$gltf.nodes.floor_center_rail_4}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, -1.83]}
    {visible}
  >
    <Joint rotation={3 * Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_5"
    is={$gltf.nodes.floor_center_rail_5}
    castShadow
    receiveShadow
    position={[-2.38, -0.26, 0]}
    {visible}
  >
    <Joint rotation={Math.PI} />
  </T>
  <T
    name="floor_center_rail_6"
    is={$gltf.nodes.floor_center_rail_6}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, 1.83]}
    {visible}
  >
    <Joint rotation={5 * Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_7"
    is={$gltf.nodes.floor_center_rail_7}
    castShadow
    receiveShadow
    position={[0, -0.26, 2.38]}
    {visible}
  >
    <Joint rotation={3 * Math.PI / 2} />
  </T>
  <T
    name="floor_center_rail_8"
    is={$gltf.nodes.floor_center_rail_8}
    castShadow
    receiveShadow
    position={[1.68, -0.26, 1.68]}
    {visible}
  >
    <Joint rotation={7 * Math.PI / 4} />
  </T>
{/if}

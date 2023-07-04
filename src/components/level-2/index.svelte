<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf, Audio } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { level, frame, setFrame, gameState } from '../../stores/state'
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
    sphere: THREE.Mesh
    sphere_band: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

const handleInteract = ({ detail }: CustomEvent<string>) => {
  console.log(detail)
  switch (detail) {
    case 'e': return setFrame('level_3')
    // case 'f': return setFrame('level_1')
  }
}

const totalMoved = 8
let entered = 0
let exited = 0

let switchState: 0 | 1 | 2 = 0
let volume = tweened(0, { duration: 2000 })

const handleEnter = (_index: number) => {
  if (switchState === 1) {
    entered += 1

    if (entered >= totalMoved) {
      switchState = 2
      $gameState = 'fixedComputer'
    }
  }
}

const handleExit = (_index: number) => {
  if (switchState === 0) {
    exited += 1

    if (exited >= totalMoved) {
      switchState = 1
    }
  }
}

$: volume.set($level === 2 && switchState === 1 ? 0.2 : 0)
$: visible = $frame === 'level_2'

</script>

<Sentry {switchState} {visible} />

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
    src={`${import.meta.env.BASE_URL}mp3/computer_battle.mp3`}
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
    <Joint {switchState} on:enter={() => handleEnter(1)} on:exit={() => handleExit(1)} />
  </T>
  <T
    name="floor_center_rail_2"
    is={$gltf.nodes.floor_center_rail_2}
    castShadow
    receiveShadow
    position={[1.68, -0.26, -1.68]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(2)} on:exit={() => handleExit(2)} rotation={Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_3"
    is={$gltf.nodes.floor_center_rail_3}
    castShadow
    receiveShadow
    position={[0, -0.26, -2.59]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(3)} on:exit={() => handleExit(3)} rotation={Math.PI / 2} />
  </T>
  <T
    name="floor_center_rail_4"
    is={$gltf.nodes.floor_center_rail_4}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, -1.83]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(4)} on:exit={() => handleExit(4)} rotation={3 * Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_5"
    is={$gltf.nodes.floor_center_rail_5}
    castShadow
    receiveShadow
    position={[-2.38, -0.26, 0]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(5)} on:exit={() => handleExit(5)} rotation={Math.PI} />
  </T>
  <T
    name="floor_center_rail_6"
    is={$gltf.nodes.floor_center_rail_6}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, 1.83]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(6)} on:exit={() => handleExit(6)} rotation={5 * Math.PI / 4} />
  </T>
  <T
    name="floor_center_rail_7"
    is={$gltf.nodes.floor_center_rail_7}
    castShadow
    receiveShadow
    position={[0, -0.26, 2.38]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(7)} on:exit={() => handleExit(7)} rotation={3 * Math.PI / 2} />
  </T>
  <T
    name="floor_center_rail_8"
    is={$gltf.nodes.floor_center_rail_8}
    castShadow
    receiveShadow
    position={[1.68, -0.26, 1.68]}
    {visible}
  >
    <Joint {switchState} on:enter={() => handleEnter(8)} on:exit={() => handleExit(8)} rotation={7 * Math.PI / 4} />
  </T>
{/if}

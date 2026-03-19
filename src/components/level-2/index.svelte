<script lang="ts">
  import type { Mesh, MeshStandardMaterial } from 'three'
  import { T } from '@threlte/core'
  import { useGltf, Audio } from '@threlte/extras'
  import { Collider } from '@threlte/rapier'
  import { level, frame, setFrame, gameState } from '../../stores/state'
  import InteractionSensor from '../interaction-sensor.svelte'
  import { Tween } from 'svelte/motion'
  import Joint from './joint.svelte'
  import Sentry from './sentry.svelte'

  interface GLTFResult {
    nodes: {
      floor_center: Mesh
      sentry: Mesh
      floor_center_rail_1: Mesh
      floor_center_rail_3: Mesh
      floor_center_rail_4: Mesh
      floor_center_rail_2: Mesh
      floor_center_rail_5: Mesh
      floor_center_rail_6: Mesh
      floor_center_rail_7: Mesh
      floor_center_rail_8: Mesh
      sphere: Mesh
      sphere_band: Mesh
    }
    materials: {
      Material: MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('./glb/ship.glb')

  const handleInteract = (key: string) => {
    switch (key) {
      case 'e': {
        return setFrame('level_3')
      }
      case 'f': {
        return setFrame('level_1')
      }
    }
  }

  const totalMoved = 8
  let entered = 0
  let exited = 0

  let switchState: 0 | 1 | 2 = $state(0)
  let volume = new Tween(0, { duration: 2000 })

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

  const visible = $derived($frame === 'level_2')

  $effect(() => {
    volume.set($level === 2 && switchState === 1 ? 0.2 : 0)
  })
</script>

<Sentry
  {switchState}
  {visible}
/>

<InteractionSensor
  shape="roundCylinder"
  args={[1, 1, 0]}
  options={['e' /* 'f' */]}
  labels={['up' /* 'down' */]}
  onInteract={handleInteract}
/>

<T.Group position.y={-0.37}>
  <Collider
    shape="roundCylinder"
    args={[0.1, 15, 0]}
  />
</T.Group>

{#if $frame !== 'title'}
  <Audio
    loop
    autoplay
    src={`${import.meta.env.BASE_URL}mp3/computer_battle.mp3`}
    volume={volume.current}
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
    <Joint
      {switchState}
      onEnter={() => handleEnter(1)}
      onExit={() => handleExit(1)}
    />
  </T>
  <T
    name="floor_center_rail_2"
    is={$gltf.nodes.floor_center_rail_2}
    castShadow
    receiveShadow
    position={[1.68, -0.26, -1.68]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(2)}
      onExit={() => handleExit(2)}
      rotation={Math.PI / 4}
    />
  </T>
  <T
    name="floor_center_rail_3"
    is={$gltf.nodes.floor_center_rail_3}
    castShadow
    receiveShadow
    position={[0, -0.26, -2.59]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(3)}
      onExit={() => handleExit(3)}
      rotation={Math.PI / 2}
    />
  </T>
  <T
    name="floor_center_rail_4"
    is={$gltf.nodes.floor_center_rail_4}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, -1.83]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(4)}
      onExit={() => handleExit(4)}
      rotation={(3 * Math.PI) / 4}
    />
  </T>
  <T
    name="floor_center_rail_5"
    is={$gltf.nodes.floor_center_rail_5}
    castShadow
    receiveShadow
    position={[-2.38, -0.26, 0]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(5)}
      onExit={() => handleExit(5)}
      rotation={Math.PI}
    />
  </T>
  <T
    name="floor_center_rail_6"
    is={$gltf.nodes.floor_center_rail_6}
    castShadow
    receiveShadow
    position={[-1.83, -0.26, 1.83]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(6)}
      onExit={() => handleExit(6)}
      rotation={(5 * Math.PI) / 4}
    />
  </T>
  <T
    name="floor_center_rail_7"
    is={$gltf.nodes.floor_center_rail_7}
    castShadow
    receiveShadow
    position={[0, -0.26, 2.38]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(7)}
      onExit={() => handleExit(7)}
      rotation={(3 * Math.PI) / 2}
    />
  </T>
  <T
    name="floor_center_rail_8"
    is={$gltf.nodes.floor_center_rail_8}
    castShadow
    receiveShadow
    position={[1.68, -0.26, 1.68]}
    {visible}
  >
    <Joint
      {switchState}
      onEnter={() => handleEnter(8)}
      onExit={() => handleExit(8)}
      rotation={(7 * Math.PI) / 4}
    />
  </T>
{/if}

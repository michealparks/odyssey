<script lang='ts'>

import * as THREE from 'three'
import { T, useTask } from '@threlte/core'
import { Collider } from '@threlte/rapier'
import { useGltf } from '@threlte/extras'
import { tweened } from 'svelte/motion'
import * as Easing from 'svelte/easing'
import { playSound } from '../../lib/sound'
import { explosionPosition } from '../../stores/state'
    import { addToBloom } from '../../lib/bloom';

type States = 'sleeping' | 'waking-up' | 'seeking' | 'charging' | 'firing' | 'shutting-down' | 'dead'

export let switchState: 0 | 1 | 2
export let visible = false

let light: THREE.SpotLight

const raycaster = new THREE.Raycaster()
const raycastPosition = new THREE.Vector3()

raycaster.near = 0
raycaster.far = 15

let state: States = 'sleeping'
let moveDirection = 1

interface GLTFResult {
  nodes: {
    sentry: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const INTENSITY = 70

let charge = tweened(0, { duration: 1000 })
let lightIntensity = tweened(0, { duration: 2000 })
let moveSpeed = tweened(0, { duration: 2000 })
let rotationY = 0

let bulletPosition = tweened<[x: number, z: number]>([0, 0], { duration: 1000 })
let bulletOpacity = tweened(0, { duration: 600 })
let explosionScale = tweened(0, { duration: 500 })

const sleeping = () => {
  if (switchState === 1 && visible) {
    state = 'waking-up'
  }
}

const wakingUp = async () => {
  stop()
  await lightIntensity.set(INTENSITY)

  state = 'seeking'
  $moveSpeed = moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03)
  start()
}

const seeking = () => {
  if (Math.random() < 0.005) {
    moveDirection = -moveDirection
    $moveSpeed *= moveDirection
  }

  if (Math.random() < 0.003) {
    $moveSpeed = moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03)
  }

  if (Math.random() < 0.02) {
    state = 'firing'
  }
}

const charging = async () => {
  stop()
  await charge.set(100)
  state = 'firing'
  start()
}

const firing = async () => {
  stop()
  await moveSpeed.set(0, { duration: 500 })
  light.getWorldPosition(raycastPosition)
  await bulletPosition.set([raycastPosition.x, raycastPosition.z], { duration: 0 })
  await bulletOpacity.set(1, { duration: 0 })
  playSound('laser.mp3')
  
  bulletOpacity.set(0)
  setTimeout(async () => {
    $explosionPosition = [...$bulletPosition]
    await explosionScale.set(1)
    explosionScale.set(0, { duration: 0 })
    $explosionPosition = null
  }, 500)
  await bulletPosition.set([0, 0])
  await moveSpeed.set(moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03), { duration: 500 })
  start()

  state = 'seeking'
}

const shutttingDown = async () => {
  stop()
  lightIntensity.set(0, { duration: 1000 })
  moveSpeed.set(0)
  state = 'sleeping'
}

const dying = async () => {
  stop()
  moveSpeed.set(0)
  await lightIntensity.set(0, { duration: 300, easing: Easing.bounceInOut })
  await lightIntensity.set(INTENSITY, { duration: 300, easing: Easing.bounceInOut })
  await lightIntensity.set(0, { duration: 300, easing: Easing.bounceInOut })
  await lightIntensity.set(INTENSITY, { duration: 300, easing: Easing.bounceInOut })
  await lightIntensity.set(0, { duration: 300, easing: Easing.bounceInOut })
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

useTask(() => {
  rotationY += $moveSpeed
})

const { stop, start } = useTask(() => {
  if (switchState === 2) {
    state = 'dead' 
  }

  switch (state) {
    case 'sleeping': return sleeping()
    case 'waking-up': return wakingUp()
    case 'seeking': return seeking()
    case 'charging': return charging()
    case 'firing': return firing()
    case 'shutting-down': return shutttingDown()
    case 'dead': return dying()
  }
}, { autoStart: false })

$: {
  if (visible) {
    start()
  } else if (state !== 'sleeping') {
    state = 'shutting-down'
  }
}

</script>

{#if $gltf}
  <T
    name="sentry"
    is={$gltf.nodes.sentry}
    castShadow
    receiveShadow
    position.y={-0.29}
    rotation.y={rotationY}
    {visible}
  />

  <T.Group
    name='bullet'
    position.x={$bulletPosition[0]}
    position.y={0.2}
    position.z={$bulletPosition[1]}
  >
    <T.Mesh>
      <T.IcosahedronGeometry args={[0.15]} />
      <T.MeshStandardMaterial transparent opacity={$bulletOpacity} color='white' />
      <T.PointLight intensity={$bulletOpacity * 15} />
    </T.Mesh>
  </T.Group>

  <T.Mesh
    name='explosion'
    position.x={$explosionPosition?.[0] ?? 0}
    position.y={0.2}
    position.z={$explosionPosition?.[1] ?? 0}
    scale={$explosionScale}
    on:create={({ ref }) => addToBloom(ref)}
  >
    <T.SphereGeometry args={[2]} />
    <T.MeshBasicMaterial
      color='#FFE0B2'
    />
  </T.Mesh>

  <T.Group rotation.y={rotationY}>
    <T.Group
      position.x={-6.78}
      position.y={0.2}
    >
      <Collider shape='ball' args={[0.5]} />
      <T.SpotLight
        name='sentry-light'
        castShadow
        color='red'
        intensity={$lightIntensity}
        angle={Math.PI / 4}
        penumbra={0.6}
        decay={0.5}
        on:create={({ ref }) => {
          ref.lookAt(0, 0, 0)
          ref.target.position.set(0, 0, 0)
          light = ref
        }}
      />
    </T.Group>
  </T.Group>
{/if}

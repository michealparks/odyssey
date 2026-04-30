<script lang="ts">
  import * as THREE from 'three'
  import { T, useTask } from '@threlte/core'
  import { Collider } from '@threlte/rapier'
  import { useGltf } from '@threlte/extras'
  import { Tween } from 'svelte/motion'
  import * as Easing from 'svelte/easing'
  import { playSound } from '../../lib/sound'
  import { explosionPosition } from '../../stores/state'
  import { addToBloom } from '../../lib/bloom'

  type Behaviors =
    | 'sleeping'
    | 'waking-up'
    | 'seeking'
    | 'charging'
    | 'firing'
    | 'shutting-down'
    | 'dead'

  interface Props {
    switchState?: 0 | 1 | 2
    visible?: boolean
  }

  let { switchState = 0, visible = false }: Props = $props()

  let light = new THREE.SpotLight()

  const raycaster = new THREE.Raycaster()
  const raycastPosition = new THREE.Vector3()

  raycaster.near = 0
  raycaster.far = 15

  let behavior = $state<Behaviors>('sleeping')
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

  let charge = new Tween(0, { duration: 1000 })
  let lightIntensity = new Tween(0, { duration: 2000 })
  let moveSpeed = new Tween(0, { duration: 2000 })
  let rotationY = $state(0)

  let bulletPosition = new Tween<[x: number, z: number]>([0, 0], { duration: 1000 })
  let bulletOpacity = new Tween(0, { duration: 600 })
  let explosionScale = new Tween(0, { duration: 500 })

  const sleeping = () => {
    if (switchState === 1 && visible) {
      behavior = 'waking-up'
    }
  }

  const wakingUp = async () => {
    stop()
    await lightIntensity.set(INTENSITY)

    behavior = 'seeking'
    moveSpeed.set(moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03))
    start()
  }

  const seeking = () => {
    if (Math.random() < 0.005) {
      moveDirection = -moveDirection
      moveSpeed.set(moveSpeed.current * moveDirection)
    }

    if (Math.random() < 0.003) {
      moveSpeed.set(moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03))
    }

    if (Math.random() < 0.02) {
      behavior = 'firing'
    }
  }

  const charging = async () => {
    stop()
    await charge.set(100)
    behavior = 'firing'
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
      explosionPosition.set([...bulletPosition.current])
      await explosionScale.set(1)
      explosionScale.set(0, { duration: 0 })
      $explosionPosition = null
    }, 500)
    await bulletPosition.set([0, 0])
    await moveSpeed.set(
      moveDirection * (0.01 + (Math.random() > 0.5 ? 0.5 : -0.5) * 0.03),
      { duration: 500 }
    )
    start()

    behavior = 'seeking'
  }

  const shutttingDown = async () => {
    stop()
    lightIntensity.set(0, { duration: 1000 })
    moveSpeed.set(0)
    behavior = 'sleeping'
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

  const gltf = useGltf<GLTFResult>(`${import.meta.env.BASE_URL}glb/ship.glb`)

  useTask(() => {
    rotationY += moveSpeed.current
  })

  const { stop, start } = useTask(
    () => {
      if (switchState === 2) {
        behavior = 'dead'
      }

      switch (behavior) {
        case 'sleeping':
          return sleeping()
        case 'waking-up':
          return wakingUp()
        case 'seeking':
          return seeking()
        case 'charging':
          return charging()
        case 'firing':
          return firing()
        case 'shutting-down':
          return shutttingDown()
        case 'dead':
          return dying()
      }
    },
    { autoStart: false }
  )

  $effect(() => {
    if (visible) {
      start()
    } else if (behavior !== 'sleeping') {
      behavior = 'shutting-down'
    }
  })
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
    name="bullet"
    position.x={bulletPosition.current[0]}
    position.y={0.2}
    position.z={bulletPosition.current[1]}
  >
    <T.Mesh>
      <T.IcosahedronGeometry args={[0.15]} />
      <T.MeshStandardMaterial
        transparent
        opacity={bulletOpacity.current}
        color="white"
      />
      <T.PointLight intensity={bulletOpacity.current * 15} />
    </T.Mesh>
  </T.Group>

  <T.Mesh
    name="explosion"
    position.x={$explosionPosition?.[0] ?? 0}
    position.y={0.2}
    position.z={$explosionPosition?.[1] ?? 0}
    scale={explosionScale.current}
    oncreate={(ref) => {
      addToBloom(ref)
    }}
  >
    <T.SphereGeometry args={[2]} />
    <T.MeshBasicMaterial color="#FFE0B2" />
  </T.Mesh>

  <T.Group rotation.y={rotationY}>
    <T.Group
      position.x={-6.78}
      position.y={0.2}
    >
      <Collider
        shape="ball"
        args={[0.5]}
      />
      <T
        is={light}
        name="sentry-light"
        castShadow
        color="red"
        intensity={lightIntensity.current}
        angle={Math.PI / 4}
        penumbra={0.6}
        decay={0.5}
        oncreate={(ref) => {
          ref.lookAt(0, 0, 0)
          ref.target.position.set(0, 0, 0)
        }}
      />
    </T.Group>
  </T.Group>
{/if}

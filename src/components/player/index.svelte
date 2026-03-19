<script lang="ts">
  import { Vector3, Vector2, MathUtils } from 'three'
  import { Tween } from 'svelte/motion'
  import { PressedKeys } from 'runed'
  import { Collider, RigidBody } from '@threlte/rapier'
  import { useTask, useThrelte } from '@threlte/core'
  import { AudioListener, HTML, useGamepad } from '@threlte/extras'
  import RAPIER from '@dimforge/rapier3d-compat'
  import {
    animationPlayerControl,
    elevatorPosition,
    gameState,
    explosionPosition,
  } from '../../stores/state'
  import Male from './model.svelte'
  import type { ActionName } from './types'

  const { camera } = useThrelte()

  const gamepad = useGamepad()
  const keys = new PressedKeys()

  const keyboardX = $derived.by(() => {
    let result = 0
    for (const key of keys.all) {
      if (key === 'd') result = 1
      if (key === 'a') result = -1
    }
    return result
  })

  const keyboardY = $derived.by(() => {
    let result = 0
    for (const key of keys.all) {
      if (key === 'w') result = 1
      if (key === 's') result = -1
    }
    return result
  })

  let rigidBody = $state.raw<RAPIER.RigidBody>()
  let action = $state<ActionName>('Man_Idle')
  let health = $state(1)

  let rotation = new Tween(0, { duration: 100 })

  let desiredRotation = 0
  let referenceAngle = 0
  let position = { x: 0, y: 0, z: 0 }

  const vec3 = new Vector3()
  const vec3_2 = new Vector3()

  explosionPosition.subscribe((value) => {
    if (value === null) return

    vec3.set(value[0], 0, value[1])
    vec3_2.set(position.x, position.y, position.z)

    const distanceSq = vec3.distanceToSquared(vec3_2)

    if (distanceSq < 4) {
      health -= 0.2
    }

    if (health <= 0) {
      stop()
      action = 'Man_Death'
      $gameState = 'lose'
    }
  })

  let cinematic = $derived(
    $gameState === 'intro' || $gameState === 'end' || $gameState === 'lose'
  )

  const t = 0.01667

  let running = $state(false)

  gameState.subscribe((value) => {
    if (value === 'awoken') {
      rigidBody?.setEnabled(true)
      rigidBody?.setTranslation({ x: 0, y: 5, z: -2 }, true)
      running = true
    }

    if ($gameState === 'end') {
      running = false
    }
  })

  function normalizeAngle(angle: number) {
    return MathUtils.euclideanModulo(angle + Math.PI, Math.PI * 2) - Math.PI
  }

  function shortestAngleDelta(from: number, to: number) {
    return normalizeAngle(to - from)
  }

  useTask(
    (delta) => {
      if (rigidBody) {
        position = rigidBody.translation()
      }

      if ($animationPlayerControl) {
        position.y = elevatorPosition.current + 0.99

        rigidBody?.setTranslation(position, true)
        return
      }

      let x = 0
      let z = 0

      const f = delta / t

      const scale = (1 / (keys.has('shift') ? 13 : 30)) * f

      x = keyboardX * scale
      z = -keyboardY * scale

      if (gamepad.connected.current) {
        const scale = 1 / 10

        x = gamepad.leftStick.x * scale
        z = gamepad.leftStick.y * scale
      } else if (touch.x !== 0 || touch.y !== 0) {
        const scale = 0.01
        const max = 0.04
        x = MathUtils.clamp(touch.x * scale, -max, max)
        z = MathUtils.clamp(touch.y * scale, -max, max)
      }

      if (x === 0 && z === 0) {
        action = 'Man_Idle'
      } else {
        action = keys.has('shift') ? 'Man_Run' : 'Man_Walk'
      }

      if (x !== 0 || z !== 0) {
        const rawTarget = referenceAngle + Math.atan2(x, z)

        const deltaToTarget = shortestAngleDelta(desiredRotation, rawTarget)

        desiredRotation = desiredRotation + deltaToTarget
        rotation.target = desiredRotation
      }

      position.x += x
      position.z += z

      rigidBody?.setLinvel({ x: 0, y: 0, z: 0 }, false)
      rigidBody?.setTranslation(position, true)
    },
    { running: () => running }
  )

  // const tw = tweened({ x: 0, y: 0, z: 0 }, { duration: 1000 })

  const tw = new Vector3()
  const tw2 = new Vector3()

  useTask(() => {
    tw.set(position.x, position.y, position.z)
    tw2.lerp(tw, 0.1)
    camera.current.lookAt(tw2.x, tw2.y, tw2.z)
  })

  let touch = new Vector2()
  let touchDown = new Vector2()

  /**
   * Extract to trzy
   */
  const handleTouchStart = (event: TouchEvent) => {
    touchDown.x = event.touches[0]?.clientX ?? 0
    touchDown.y = event.touches[0]?.clientY ?? 0
  }

  const handleTouchMove = (event: TouchEvent) => {
    touch.x = ((event.changedTouches[0]?.clientX ?? 0) - touchDown.x) / 10
    touch.y = ((event.changedTouches[0]?.clientY ?? 0) - touchDown.y) / 10
  }

  const handleTouchEnd = () => {
    touch.x = 0
    touch.y = 0
  }
</script>

<svelte:window
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
/>

<RigidBody
  enabled={!cinematic && !$animationPlayerControl}
  enabledRotations={[false, false, false]}
  type="dynamic"
  oncreate={(ref) => {
    rigidBody = ref
  }}
>
  <AudioListener />

  <Collider
    shape="capsule"
    args={[0.5, 0.3]}
  />

  {#if health < 1 && $gameState === 'seeking'}
    <HTML center>
      <div class="w-10 h-2 border border-red-500 -translate-y-14">
        <div
          class="w-full h-full bg-red-500 origin-left"
          style="transform: scale({Math.max(health, 0)}, 1)"
        ></div>
      </div>
    </HTML>
  {/if}

  <Male
    visible={$gameState !== 'intro'}
    action={$animationPlayerControl ? 'Man_Idle' : action}
    position.y={-0.77}
    rotation.y={rotation.current}
  />
</RigidBody>

<script lang='ts'>

import * as THREE from 'three'
import { tweened } from 'svelte/motion'
import { useKeyboard } from 'trzy'
import { Collider, RigidBody } from '@threlte/rapier'
import { useTask, useThrelte } from '@threlte/core'
import { AudioListener, HTML, useGamepad } from '@threlte/extras'
import RAPIER from '@dimforge/rapier3d-compat'
import { animationPlayerControl, elevatorPosition, gameState, explosionPosition } from '../../stores/state'
import Male from './model.svelte'
import type { ActionName } from './types'

const { camera } = useThrelte()

const gamepad = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

let action: ActionName = 'Man_Idle'
let health = 1

const zeroVector = { x: 0, y: 0, z: 0 }

let rotation = tweened(0, { duration: 100 })

let desiredRotation = 0
let referenceAngle = 0
let position = { x: 0, y: 0, z: 0 }

gameState.subscribe((value) => {
  if (value === 'awoken') {
    rigidBody.setEnabled(true)
    rigidBody.setTranslation({ x: 0, y: 5, z: -2 }, true)
    start()
  }

  if ($gameState === 'end') {
    stop()
  }
})

const vec3 = new THREE.Vector3()
const vec3_2 = new THREE.Vector3()

explosionPosition.subscribe(value => {
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

$: cinematic = $gameState === 'intro' || $gameState === 'end' || $gameState === 'lose'

const t = 0.01667

const { start, stop } = useTask((delta) => {
  position = rigidBody.translation()

  if ($animationPlayerControl) {
    position.y = $elevatorPosition + 0.99
    
    rigidBody.setTranslation(position, true)
    return
  }

  let x = 0
  let z = 0

  const f = delta / t

  if (keyboard.controlling) {
    const scale = 1 / (keyboard.keys['shift'] ? 13 : 30) * f

    x = keyboard.x * scale
    z = -keyboard.y * scale

    if (x !== 0 && z !== 0) {
      x /= 1.5
      z /= 1.5
    }
  } else if (gamepad.connected) {
    const scale = 1 / 10

    x = gamepad.leftStick.x * scale
    z = gamepad.leftStick.y * scale
  } else if (touch.x !== 0 || touch.y !== 0) {
    const scale = 0.01
    const max = 0.04
    x = THREE.MathUtils.clamp(touch.x * scale, -max, max)
    z = THREE.MathUtils.clamp(touch.y * scale, -max, max)
  }

  if (x === 0 && z === 0) {
    action = 'Man_Idle'
  } else {
    action = keyboard.keys['shift'] ? 'Man_Run' : 'Man_Walk'
  }

  if (x !== 0 || z !== 0) {
    let nextRotation = referenceAngle + Math.atan2(x, z)
  
    const startRotation = desiredRotation
    const dif = nextRotation - startRotation

    // if (dif > Math.PI) console.log('dif > +PI', startRotation, nextRotation)
    // if (dif < -Math.PI) console.log('dif <-PI', startRotation, nextRotation)

    // // Going left
    // if (dif < -Math.PI) {
    //   referenceAngle += Math.PI * 2
    //   nextRotation += referenceAngle
    // }
  
    // // Going right
    // if (dif > Math.PI) {
    //   referenceAngle -= Math.PI * 2
    //   nextRotation += referenceAngle
    // }
  
    desiredRotation = nextRotation
    $rotation = nextRotation
    // $rotation = Math.atan2(x, z)
  }

  position.x += x
  position.z += z

  rigidBody.setLinvel(zeroVector, false)
  rigidBody.setTranslation(position, true)
}, { autoStart: false })

// const tw = tweened({ x: 0, y: 0, z: 0 }, { duration: 1000 })

const tw = new THREE.Vector3()
const tw2 = new THREE.Vector3()

useTask(() => {
  tw.set(position.x, position.y, position.z)
  tw2.lerp(tw, 0.1)
  camera.current.lookAt(tw2.x, tw2.y, tw2.z)
})

let touch = new THREE.Vector2()
let touchDown = new THREE.Vector2()

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
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
/>

<RigidBody
  enabled={!cinematic && !$animationPlayerControl}
  enabledRotations={[false, false, false]}
  bind:rigidBody
  type='dynamic'
>
  <AudioListener />

  <Collider
    bind:collider
    shape='capsule'
    args={[0.5, 0.3]}
  />

  {#if health < 1 && $gameState === 'seeking'}
    <HTML center>
      <div class='w-10 h-2 border border-red-500 -translate-y-14'>
        <div class='w-full h-full bg-red-500 origin-left' style='transform: scale({Math.max(health, 0)}, 1)' />
      </div>
    </HTML>
  {/if}

  <Male
    visible={$gameState !== 'intro'}
    action={$animationPlayerControl ? 'Man_Idle' : action}
    position.y={-0.77}
    rotation.y={$rotation}
  />
</RigidBody>

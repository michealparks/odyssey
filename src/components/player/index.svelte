<script lang='ts'>

import * as THREE from 'three'
import { tweened } from 'svelte/motion'
import { useKeyboard, useGamepad } from 'trzy'
import { Collider, RigidBody } from '@threlte/rapier'
import { useFrame, useThrelte } from '@threlte/core'
import { AudioListener, HTML } from '@threlte/extras'
import type RAPIER from '@dimforge/rapier3d-compat'
import { animationPlayerControl, elevatorPosition, gameState, explosionPosition } from '../../stores/state'
import Male from './model.svelte'
import type { ActionName } from './types'

const { scene } = useThrelte()

const { gamepad1, updateGamepad } = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

let action: ActionName = 'Man_Idle'
let health = 1

let rotation = tweened(0, { duration: 100 })

let desiredRotation = 0
let referenceAngle = 0
let position = { x: 0, y: 0, z: 0 }

gameState.subscribe((value) => {
  if (value === 'awoken') {
    rigidBody.setEnabled(true)
    rigidBody.setTranslation({ x: 0, y: 5, z: -2.75 }, true)
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

const { start, stop } = useFrame((_ctx, delta) => {
  position = rigidBody.translation()

  if ($animationPlayerControl) {
    position.y = $elevatorPosition + 0.97
    
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
  } else if (gamepad1.connected) {
    const scale = 1 / 10

    updateGamepad()
    x = gamepad1.leftStickX * scale
    z = gamepad1.leftStickY * scale
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

  rigidBody.setTranslation(position, true)
}, { autostart: false })

const tw = tweened({ x: 0, y: 0, z: 0 }, { duration: 1000 })

useFrame(() => {
  tw.set({ ...position })
  const cam = scene.getObjectByName('Camera')
  cam?.lookAt($tw.x, $tw.y, $tw.z)
})

</script>

<RigidBody
  enabled={!cinematic && !$animationPlayerControl}
  enabledRotations={[false, false, false]}
  enabledTranslations={[true, false, true]}
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

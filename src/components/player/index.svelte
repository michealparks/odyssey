<script lang='ts'>

import { tweened } from 'svelte/motion'
import { useKeyboard, useGamepad } from 'trzy'
import { Collider, RigidBody } from '@threlte/rapier'
import { useFrame } from '@threlte/core'
import { AudioListener } from '@threlte/extras'
import type RAPIER from '@dimforge/rapier3d-compat'
import { animationPlayerControl, elevatorPosition, gameState } from '../../stores/state'
import Male from './model.svelte'
import type { ActionName } from './types'

const { gamepad1, updateGamepad } = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

let action: ActionName = 'Man_Idle'

let rotation = tweened(0, { duration: 100 })

let desiredRotation = 0
let referenceAngle = 0

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

$: cinematic = $gameState === 'intro' || $gameState === 'end'

const { start, stop } = useFrame((_ctx, _delta) => {
  const desiredTranslation = rigidBody.translation()

  if ($animationPlayerControl) {
    desiredTranslation.y = $elevatorPosition + 0.97
    
    rigidBody.setTranslation(desiredTranslation, true)
    return
  }

  let x = 0
  let z = 0

  if (keyboard.controlling) {
    const scale = 1 / (keyboard.keys['shift'] ? 13 : 30)

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

  desiredTranslation.x += x
  desiredTranslation.z += z

  rigidBody.setTranslation(desiredTranslation, true)
}, { autostart: false })

</script>

<RigidBody
  dominance={1}
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

  <Male
    visible={$gameState !== 'intro'}
    {action}
    position.y={-0.77}
    rotation.y={$rotation}
  />
</RigidBody>

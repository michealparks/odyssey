<script lang='ts'>

import { tweened } from 'svelte/motion'
import { useKeyboard, useGamepad } from 'trzy'
import { Collider, RigidBody } from '@threlte/rapier'
import { useFrame } from '@threlte/core'
import { AudioListener } from '@threlte/extras'
import type RAPIER from '@dimforge/rapier3d-compat'
import { animationPlayerControl, elevatorPosition } from '../../stores/state'
import Male from './male.svelte'

// const { world } = useRapier()

const { gamepad1, updateGamepad } = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

const frame = localStorage.getItem('frame') ?? 'title'
const position: [x: number, y: number, z: number] = frame === 'level_2' ? [0, 0, 0] : [0, 5.5, -2.5]

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

let action = 'Man_Idle'

// const characterController = world.createCharacterController(0.01);

let rotation = tweened(0, { duration: 100 })

$: rigidBody?.setEnabled(!$animationPlayerControl)

useFrame((_ctx, _delta) => {
  if (!rigidBody) return

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
    const nextRotation = Math.atan2(x, z)
  
    if ($rotation < 0 && nextRotation > 0) {

    }
  
    $rotation = Math.atan2(x, z)
  }

  desiredTranslation.x += x
  desiredTranslation.z += z

  // characterController.computeColliderMovement(collider, desiredTranslation)

  // const correctedMovement = characterController.computedMovement()
  // characterController.computeColliderMovement(collider, desiredTranslation);

  // for (let i = 0; i < characterController.numComputedCollisions(); i++) {
  //   let collision = characterController.computedCollision(i);
  //   // Do something with that collision information.
  //   console.log(collision)
  // }

  // console.log(correctedMovement.x, correctedMovement.z)

  rigidBody.setTranslation(desiredTranslation, true)

  // rigidBody.setNextKinematicTranslation(correctedMovement)
})

</script>

<RigidBody
  dominance={1}
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

  <Male
    {action}
    position.y={-0.77}
    rotation.y={$rotation}
  />
</RigidBody>

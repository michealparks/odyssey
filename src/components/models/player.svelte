<script lang='ts'>

import { tweened } from 'svelte/motion'
import { useKeyboard, useGamepad } from 'trzy'
import { Collider, RigidBody, useRapier } from '@threlte/rapier'
import { T, useFrame } from '@threlte/core'
import type RAPIER from '@dimforge/rapier3d-compat'
import { level, allowUserControl } from '../../stores/state'
import Male from './male.svelte'

const { world } = useRapier()
const { gamepad, updateGamepad } = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

type PlayerStates = 'idle' | 'walking'

let state: PlayerStates = 'idle'
let action = 'Man_Idle'

const characterController = world.createCharacterController(0.01);

let rotation = tweened(0, { duration: 100 })

rotation.subscribe((value) => console.log(value))

useFrame(() => {
  if (!rigidBody) return
  if (!allowUserControl) return

  const desiredTranslation = rigidBody.translation()

  let x = 0
  let z = 0

  if (keyboard.controlling) {
    const scale = 1 / (keyboard.keys.shift ? 15 : 40)

    x = keyboard.x * scale
    z = -keyboard.y * scale

    if (x !== 0 && z !== 0) {
      x /= 1.5
      z /= 1.5
    }
  } else if (gamepad.connected) {
    const scale = 1 / 10

    updateGamepad()
    x = gamepad.leftStickX * scale
    z = gamepad.leftStickY * scale
  }

  if (x === 0 && z === 0) {
    action = 'Man_Idle'
  } else {
    action = keyboard.keys.shift ? 'Man_Run' : 'Man_Walk'
  }

  if (x !== 0 || z !== 0) {
    $rotation = Math.atan2(x, z)
  }
  
  
  desiredTranslation.x += x
  desiredTranslation.z += z

  characterController.computeColliderMovement(collider, desiredTranslation)

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

$: {
  if (rigidBody) {
    const t = rigidBody.translation()
    switch ($level) {
      case 3: t.y = 4.5; break;
      case 2: t.y = 0.5; break; 
      case 1: t.y = -4.1; break;
    }
    requestAnimationFrame(() => rigidBody.setTranslation(t, true))
  }
}

</script>

<RigidBody
  dominance={0}
  enabledRotations={[false, false, false]}
  bind:rigidBody
  position={[0, 5.5, -2.5]}
  type='dynamic'
>
  <Collider
    bind:collider
    shape='capsule'
    args={[0.5, 0.3]}
  />

  <Male
    {action}
    rotation.y={$rotation}
  />
  <!-- <T.Mesh
    receiveShadow
    castShadow
  >
    <T.MeshStandardMaterial />
    <T.BoxGeometry args={[0.6, 1.8, 0.6]} />
  </T.Mesh> -->
</RigidBody>

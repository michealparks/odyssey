<script lang='ts'>

import { useKeyboard, useGamepad } from 'trzy'
import { Collider, RigidBody, useRapier } from '@threlte/rapier'
import { T, useFrame } from '@threlte/core'
import type RAPIER from '@dimforge/rapier3d-compat'
import { level } from '../../stores/state'

const { world } = useRapier()
const { gamepad, updateGamepad } = useGamepad()
const { keyboard } = useKeyboard({ preventDefault: false })

let collider: RAPIER.Collider
let rigidBody: RAPIER.RigidBody

const characterController = world.createCharacterController(0.01);

useFrame(() => {
  if (!rigidBody) return
  const desiredTranslation = rigidBody.translation()

  let x = 0
  let z = 0

  if (keyboard.controlling) {
    const scale = 1 / 10
    x = keyboard.x * scale
    z = -keyboard.y * scale
  } else if (gamepad.connected) {
    const scale = 1 / 10

    updateGamepad()
    x = gamepad.leftStickX * scale
    z = gamepad.leftStickY * scale
  }

  desiredTranslation.x += x
  desiredTranslation.z += z
  
  characterController.computeColliderMovement(collider, desiredTranslation)

  const correctedMovement = characterController.computedMovement()
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
  position={[2, 5.5, 2]}
  type='dynamic'
>
  <Collider
    bind:collider
    shape='capsule'
    args={[0.5, 0.3]}
  />

  <T.Mesh
    receiveShadow
    castShadow
  >
    <T.MeshStandardMaterial />
    <T.BoxGeometry args={[0.6, 1.8, 0.6]} />
  </T.Mesh>
</RigidBody>

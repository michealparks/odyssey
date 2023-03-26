<script lang='ts'>

import { keyboardManager, gamepadManager } from 'trzy'
import { AutoColliders, BasicPlayerController, RigidBody } from '@threlte/rapier';
import { T, useFrame } from '@threlte/core'

const { gamepad } = gamepadManager()
const { keyboard } = keyboardManager()

useFrame(() => {
  
})

</script>

<BasicPlayerController
	speed={5}
	radius={0.3}
	height={1.8}
	jumpStrength={0}
	groundCollisionGroups={[15]}
	playerCollisionGroups={[0]}
  position={[0, 4, 0]}
>
  <T.Mesh
    receiveShadow
    castShadow
    position={[0, 0.9, 0]}
  >
    <T.MeshStandardMaterial />
    <T.BoxGeometry args={[0.6, 1.8, 0.6]} />
  </T.Mesh>
</BasicPlayerController>

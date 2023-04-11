<script lang='ts'>

import { T } from '@threlte/core'
import { RigidBody, Collider } from '@threlte/rapier'

export let position: [x: number, y: number, z: number] = [0, 0, 0]
export let rigidBody

const rotation: [x: number, y: number, z: number] = [
  Math.random() * 2 * Math.PI,
  Math.random() * 2 * Math.PI,
  Math.random() * 2 * Math.PI,
]

</script>

<RigidBody
  type='dynamic'
  enabledRotations={[false, false, false]}
  {position}
  {rotation}
  bind:this={$rigidBody}
>
  <T.Mesh name='Box' castShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial />
  </T.Mesh>

  <Collider
		contactForceEventThreshold={30}
		restitution={0.4}
		shape='cuboid'
    mass={0.1}
		args={[0.5, 0.5, 0.5]}
	/>
</RigidBody>

<script lang='ts'>

import { T } from '@threlte/core'
import { RigidBody, Collider } from '@threlte/rapier'

const position: [x: number, y: number, z: number] = [
  (Math.random() * 6) - 3,
  0.5,
  (Math.random() * 6) - 3,
]

const rotation: [x: number, y: number, z: number] = [
  Math.random() * 2 * Math.PI,
  Math.random() * 2 * Math.PI,
  Math.random() * 2 * Math.PI,
]

</script>

<RigidBody
  type='dynamic'
  {position}
  {rotation}
>
  <T.Mesh name='Box' castShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial />
  </T.Mesh>

  <Collider
		contactForceEventThreshold={30}
		restitution={0.4}
		shape='cuboid'
		args={[0.5, 0.5, 0.5]}
	/>
</RigidBody>

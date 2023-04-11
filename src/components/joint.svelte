<script lang='ts'>

import { T } from '@threlte/core'
import { usePrismaticJoint, RigidBody, Collider } from '@threlte/rapier'

export let rotation = 0

const { joint, rigidBodyA, rigidBodyB } = usePrismaticJoint([0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 3])

</script>

<RigidBody
  type='dynamic'
  bind:rigidBody={$rigidBodyA}
  position={[0, 1, 0]}
>
  <Collider
    mass={0.1}
    shape="cuboid"
    args={[0.5, 0.5, 0.5]}
  />
  <T.Mesh castShadow receiveShadow>
    <T.MeshStandardMaterial color='red' />
    <T.BoxGeometry args={[1, 1, 1]} />
  </T.Mesh>
</RigidBody>

<RigidBody
  type='fixed'
  bind:rigidBody={$rigidBodyB}
  position={[0, 0.49, 0]}
  rotation={[0, rotation, 0]}
>
  <Collider
    shape="cuboid"
    args={[0, 0, 0]}
  />
</RigidBody>

<script lang='ts'>

import { T } from '@threlte/core'
import { usePrismaticJoint, RigidBody, Collider } from '@threlte/rapier'
import { createEventDispatcher } from 'svelte';

export let rotation = 0

const dispatch = createEventDispatcher()

const { joint, rigidBodyA, rigidBodyB } = usePrismaticJoint([0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 3])

const handleEnter = () => dispatch('enter')
const handleExit = () => dispatch('exit')

</script>

<T.Group position.y={0.6} rotation.y={rotation}>
  <RigidBody
    type='fixed'
    bind:rigidBody={$rigidBodyB}
  >
    <Collider shape="cuboid" args={[0, 0, 0]} />
  </RigidBody>
</T.Group>

<T.Group position.y={0.7} rotation.y={rotation}>
  <RigidBody
    type='dynamic'
    enabledRotations={[false, false, false]}
    enabledTranslations={[true, false, true]}
    bind:rigidBody={$rigidBodyA}
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

  <Collider
    shape='ball'
    args={[0.2]}
    sensor
    on:sensorenter={handleEnter}
    on:sensorexit={handleExit}
  />
</T.Group>

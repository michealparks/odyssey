<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { level, setFrame } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte'

interface GLTFResult {
  nodes: {
    floor_center: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

const handleInteract = ({ detail }: CustomEvent<string>) => {
  switch (detail) {
    case 'e': return setFrame('level_3')
    case 'f': return setFrame('level_1')
  }
}

</script>

{#if $level === 2}
  <InteractionSensor
    shape='cuboid'
    position={[0, 0, 1.5]}
    args={[1, 1, 1]}
    options={['e', 'f']}
    labels={['up', 'down']}
    on:interact={handleInteract}
  />
{/if}

{#if $gltf}
  <T
    is={$gltf.nodes.floor_center}
    visible={$level > 1}
    receiveShadow
    position={[0, -0.29, 0]}
  />
{/if}

<Collider
  shape='roundCylinder'
  args={[0.1, 15, 0]}
  position={[0, -0.37, 0]}
/>

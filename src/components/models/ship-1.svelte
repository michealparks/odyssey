<script lang='ts'>

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { level, setFrame } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte'

interface GLTFResult {
  nodes: {
    floor_bottom: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

</script>

{#if $level === 1}
  <InteractionSensor
    shape='cuboid'
    position={[0, -4, 1.5]}
    args={[1, 1, 1]}
    options={['e']}
    labels={['up']}
    on:interact={() => setFrame('level_2')}
  />

  <!-- floor_bottom -->
  <Collider
    shape='roundCylinder'
    position={[0, -4.13, 0]}
    args={[0.1, 7.15, 0]}
  />
{/if}
  
{#if $gltf}
  <T
    is={$gltf.nodes.floor_bottom}
    receiveShadow
    position={[0, -4.13, 0]}
  />
{/if}

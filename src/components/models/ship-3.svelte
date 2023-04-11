<script lang='ts'>

import { useGltf } from '@threlte/extras'
import { Collider, AutoColliders } from '@threlte/rapier'
import { T } from '@threlte/core'
import ConsoleScreen from './console-screen.svelte'
import InteractionSensor from '../interaction-sensor.svelte'
import { setFrame } from '../../stores/state'
import { level } from '../../stores/state'

interface GLTFResult {
  nodes: {
    console: THREE.Mesh
    console_screen: THREE.Mesh
    exterior_top: THREE.Mesh
    floor_top: THREE.Mesh
    floor_top_railing: THREE.Mesh
    stasis_chamber: THREE.Mesh
  }
  materials: {
    Exterior: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
  }
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

</script>

{#if $level === 3}
  <InteractionSensor
    shape='cuboid'
    position={[4.77, 4.63, -0.09]}
    args={[1, 1, 1]}
    options={['e']}
    labels={['interact']}
    on:interact={() => setFrame('level_3_console')}
    on:exit={() => setFrame('level_3')}
  />

  <InteractionSensor
    shape='roundCylinder'
    position={[0, 3.87, 0]}
    args={[1, 1.2, 0]}
    options={['f']}
    labels={['down']}
    on:interact={() => setFrame('level_2')}
  />

  <!-- floor_top -->
  <Collider
    shape='roundCylinder'
    args={[0.1, 15, 0]}
    position={[0, 3.87, 0]}
  />
{/if}

{#if $gltf}
  <ConsoleScreen visible={$level > 2} />

  <T
    is={$gltf.nodes.floor_top}
    receiveShadow
    visible={$level > 2}
  />

  <T
    is={$gltf.nodes.stasis_chamber}
    castShadow
    receiveShadow
    visible={$level > 2}
  >
    {#if $level === 3}
      <Collider
        shape='roundCylinder'
        args={[1.3, 0.9, 0]}
      />
    {/if}
  </T>

  <T
    is={$gltf.nodes.floor_top_railing}
    castShadow
    receiveShadow
    visible={$level > 2}
  />

  <AutoColliders shape='cuboid'>
    <T
      is={$gltf.nodes.console}
      castShadow
      receiveShadow
      visible={$level > 2}
    />
  </AutoColliders>
{/if}

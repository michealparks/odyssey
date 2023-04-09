<script lang="ts">

import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import InteractionSensor from '../interaction-sensor.svelte'
import ShipExterior from './ship-exterior.svelte'
import ShipLevel3 from './ship-3.svelte'
import ShipLevel2 from './ship-2.svelte'
import ShipLevel1 from './ship-1.svelte'
import { setFrame, elevatorPosition } from '../../stores/state';

interface GLTFResult {
  nodes: {
    elevator_platform: THREE.Mesh
  }
  materials: {
    Exterior: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
  }
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

</script>

<ShipExterior />
<ShipLevel3 />
<ShipLevel2 />
<ShipLevel1 />

<InteractionSensor
  shape='roundCylinder'
  position={[0, 3.87, 0]}
  args={[1, 1.2, 0]}
  options={['f']}
  labels={['down']}
  on:interact={() => setFrame('level_2')}
/>

{#if $gltf}
  <T
    name="elevator_platform"
    is={$gltf.nodes.elevator_platform}
    castShadow
    receiveShadow
    position.y={$elevatorPosition}
  />
{/if}

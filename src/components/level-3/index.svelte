<script lang='ts'>

import { useGltf } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { T } from '@threlte/core'
import Console from './console.svelte'
import InteractionSensor from '../interaction-sensor.svelte'
import { setFrame } from '../../stores/state'
import { frame } from '../../stores/state'
import Colliders from './colliders.svelte'

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

$: visible = $frame.includes('level_3')

</script>

<InteractionSensor
  shape='roundCylinder'
  position.y={3.87}
  args={[1, 1.2, 0]}
  options={['f']}
  labels={['down']}
  on:interact={() => setFrame('level_2')}
/>

<!-- floor_top -->
<T.Group position.y={3.87}>
  <Collider
    shape='roundCylinder'
    args={[0.1, 15, 0]}
  />
</T.Group>

<Colliders />

{#if $gltf}
  <Console />

  <T
    is={$gltf.nodes.floor_top}
    receiveShadow
    {visible}
  />

  <T
    is={$gltf.nodes.stasis_chamber}
    castShadow
    receiveShadow
    {visible}
  >
    <Collider
      shape='roundCylinder'
      args={[1.3, 0.9, 0]}
    />
  </T>

  <T
    is={$gltf.nodes.floor_top_railing}
    castShadow
    receiveShadow
    {visible}
  />
{/if}

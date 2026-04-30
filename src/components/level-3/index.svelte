<script lang="ts">
  import * as THREE from 'three'
  import { useGltf } from '@threlte/extras'
  import { Collider } from '@threlte/rapier'
  import { T } from '@threlte/core'
  import Console from './console.svelte'
  import InteractionSensor from '../interaction-sensor.svelte'
  import { setFrame } from '../../stores/state'
  import { frame } from '../../stores/state'
  import Chamber from './chamber.svelte'
  import { setStatic } from '../../lib/static'

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

  const gltf = useGltf<GLTFResult>(`${import.meta.env.BASE_URL}glb/ship.glb`)

  let visible = $derived($frame.includes('level_3'))
</script>

<InteractionSensor
  shape="roundCylinder"
  position.y={3.87}
  args={[1, 1.2, 0]}
  options={['f']}
  labels={['down']}
  onInteract={() => setFrame('level_2')}
/>

<!-- floor_top -->
<T.Group
  position.y={3.87}
  oncreate={(ref) => {
    setStatic(ref)
  }}
>
  <Collider
    shape="roundCylinder"
    args={[0.1, 15, 0]}
  />
</T.Group>

{#if $gltf}
  <Console />
  <Chamber />

  <T
    is={$gltf.nodes.floor_top}
    receiveShadow
    {visible}
    oncreate={(ref) => {
      setStatic(ref)
    }}
  />

  <T
    is={$gltf.nodes.stasis_chamber}
    castShadow
    receiveShadow
    {visible}
    oncreate={(ref) => setStatic(ref)}
  >
    <Collider
      shape="roundCylinder"
      args={[1.3, 0.9, 0]}
    />
  </T>

  <T
    is={$gltf.nodes.floor_top_railing}
    castShadow
    receiveShadow
    {visible}
    oncreate={(ref) => {
      setStatic(ref)
    }}
  />
{/if}

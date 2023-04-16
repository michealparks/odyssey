<script lang="ts">

import { tweened } from 'svelte/motion'
import { T } from '@threlte/core'
import { useGltf, Audio } from '@threlte/extras'
import ShipExterior from './ship-exterior.svelte'
import ShipLevel3 from './ship-3.svelte'
import ShipLevel2 from './ship-2.svelte'
import ShipLevel1 from './ship-1.svelte'
import { elevatorPosition, frame } from '../../stores/state';

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

let volume = tweened(0, { duration: 700 })

$: {
  if ($elevatorPosition === 3.83 || $elevatorPosition === -0.48) {
    $volume = 0
  } else {
    $volume = 0.08
  }
}

</script>

<ShipExterior />
<ShipLevel3 />
<ShipLevel2 />
<ShipLevel1 />

{#if $gltf}
  <T
    name="elevator_platform"
    is={$gltf.nodes.elevator_platform}
    castShadow
    receiveShadow
    position.y={$elevatorPosition}
    visible={$frame !== 'title'}
  />
{/if}

{#if $volume !== 0}
  <Audio
    autoplay
    src='/mp3/elevator.mp3'
    volume={$volume}
  />
{/if}
<script lang="ts">

import { tweened } from 'svelte/motion'
import { T } from '@threlte/core'
import { useGltf, Audio } from '@threlte/extras'
import Exterior from './exterior.svelte'
import Level3 from '../level-3/index.svelte'
import Level2 from '../level-2/index.svelte'
import Level1 from './level-1.svelte'
import { elevatorPosition, frame } from '../../stores/state';
import Colliders from './colliders.svelte'

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

<Exterior />
<Level3 />
<Level2 />
<!-- <Level1 /> -->

<Colliders />

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
    src={`${import.meta.env.BASE_URL}mp3/elevator.mp3`}
    volume={$volume}
  />
{/if}

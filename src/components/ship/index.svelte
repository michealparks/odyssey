<script lang="ts">
  import { Tween } from 'svelte/motion'
  import { T } from '@threlte/core'
  import { useGltf, Audio } from '@threlte/extras'
  import Exterior from './exterior.svelte'
  import Level3 from '../level-3/index.svelte'
  import Level2 from '../level-2/index.svelte'
  import Level1 from './level-1.svelte'
  import { elevatorPosition, frame } from '../../stores/state'
  import Colliders from './colliders.svelte'
  import type { Mesh, MeshStandardMaterial } from 'three'

  interface GLTFResult {
    nodes: {
      elevator_platform: Mesh
    }
    materials: {
      Exterior: MeshStandardMaterial
      Material: MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('./glb/ship.glb')

  const volume = new Tween(0, { duration: 700 })

  $effect(() => {
    if (elevatorPosition.current === 3.83 || elevatorPosition.current === -0.48) {
      volume.target = 0
    } else {
      volume.target = 0.08
    }
  })
</script>

<Exterior />
<Level3 />
<Level2 />
<Level1 />

<Colliders />

{#if $gltf}
  <T
    name="elevator_platform"
    is={$gltf.nodes.elevator_platform}
    castShadow
    receiveShadow
    position.y={elevatorPosition.current}
    visible={$frame !== 'title'}
  />
{/if}

{#if volume.current !== 0}
  <Audio
    autoplay
    src={`${import.meta.env.BASE_URL}mp3/elevator.mp3`}
    volume={volume.current}
  />
{/if}

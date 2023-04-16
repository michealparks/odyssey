<script lang='ts'>

import { T, useThrelte } from '@threlte/core'
import Stars from './stars.svelte'
import Ship from './ship/index.svelte'
import Player from './player/index.svelte'
import Lights from './lights.svelte'
import { cameraPosition, cameraRotation, frame } from '../stores/state'
import { softShadows, resetSoftShadows } from 'trzy'

const { renderer, scene, camera } = useThrelte()

softShadows()
resetSoftShadows(renderer!, scene, $camera)

</script>

<T.PerspectiveCamera
  makeDefault
  position={$cameraPosition}
  rotation={$cameraRotation}
  near={0.1}
  far={2500}
  on:create={({ ref }) => ref.lookAt(0, 1, 0)}
/>

<Stars />

{#if $frame !== 'title'}
  <Player />
{/if}

<Ship />
<Lights />
<script lang='ts'>

import { T } from '@threlte/core'
import { Audio } from '@threlte/extras'
import Stars from './stars.svelte'
import Ship from './ship/index.svelte'
import Player from './player/index.svelte'
import Lights from './lights.svelte'
import { cameraPosition, cameraRotation, gameState } from '../stores/state'
import Composer from './composer.svelte'
import { configure } from '../lib/config'

configure()

</script>

<Composer />

<T.PerspectiveCamera
  name='Camera'
  makeDefault
  position={$cameraPosition}
  near={0.1}
  far={2500}
/>

<Stars />
<Player />
<Ship />
<Lights />

{#if $gameState === 'end'}
  <Audio
    loop
    autoplay
    src='/mp3/end.mp3'
    volume={0.3}
  />
{/if}
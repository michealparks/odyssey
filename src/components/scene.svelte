<script lang='ts'>

import { Audio } from '@threlte/extras'
import Stars from './stars.svelte'
import Ship from './ship/index.svelte'
import Player from './player/index.svelte'
import Lights from './lights.svelte'
import { gameState } from '../stores/state'
import Composer from './composer.svelte'
import { configure } from '../lib/config'

configure()

</script>

<Composer />
<Stars />
<Player />
<Ship />
<Lights />

{#if $gameState === 'end'}
  <Audio
    loop
    autoplay
    src={`${import.meta.env.BASE_URL}mp3/end.mp3`}
    volume={0.3}
  />
{/if}

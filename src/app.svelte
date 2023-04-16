<script lang='ts'>

import { Canvas } from '@threlte/core'
import { World } from '@threlte/rapier'
import { frame } from './stores/state'
import Scene from './components/scene.svelte'
import Debug from './components/debug.svelte'
import Title from './components/title.svelte'

</script>

<Canvas useLegacyLights={false}>
  <World>
    <Debug />
    <Scene />
    <div slot='fallback'>
      I'm sorry, your browser does not support WASM.
      Please try a different browser or upgrade your current one.
    </div>
  </World>
</Canvas>

{#if $frame === 'title'}
  <Title />
{/if}

<script lang='ts'>

import { Canvas } from '@threlte/core'
import { World } from '@threlte/rapier'
import { frame, gameState } from './stores/state'
import Scene from './components/scene.svelte'
import Debug from './components/debug.svelte'
import Title from './components/title.svelte'
import Menu from './components/menu.svelte'
import { graphics } from './stores/settings';

$: dpr = $graphics === 'performance' ? Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio

</script>

<Canvas {dpr} useLegacyLights={false}>
  <World>
    <Debug />
    <Scene />
    <div slot='fallback'>
      I'm sorry, your browser does not support WASM.
      Please try a different browser or upgrade your current one.
    </div>
  </World>
</Canvas>

{#if $frame === 'title' || $frame === 'end'}
  <Title />
{:else if $gameState === 'lose'}
  <div class='absolute top-0 left-0 w-full h-full grid place-content-center gap-4 bg-black bg-opacity-50 text-white font-sans'>
    <h1 class='text-7xl font-extralight'>You died</h1>
    <button class='text-base' on:click={() => location.reload()}>Again?</button>
  </div>
{/if}

<Menu />

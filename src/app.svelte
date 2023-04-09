<script lang='ts'>

import { Canvas } from '@threlte/core'
import { World } from '@threlte/rapier'
import { frame, setFrame } from './stores/state'
import Scene from './components/scene.svelte'
import Stats from './components/stats.svelte'
import Debug from './components/debug.svelte'

window.addEventListener('keyup', () => setFrame('level_3'), { once: true })
window.addEventListener('click', () => setFrame('level_3'), { once: true })

</script>

<Canvas>
  <World>
    <Stats />
    <Debug />
    <Scene />
    <div slot='fallback'>
      Your browser does not support WASM. Please use a modern browser.
    </div>
  </World>
</Canvas>


{#if $frame === 'title'}
  <header>
    <h1>odyssey</h1>
  </header>

  <section>
    <button>
      begin
    </button>
  </section>
{/if}

<style>
  header {
    width: 100vw;
    height: 100vh;
    display: grid;
    place-content: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  h1 {
    display: none;
    cursor: default;
    margin-top: -26px;
    color: white;
    font-size: 8rem;
    font-weight: 100;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  section {
    z-index: 10;
    position: absolute;
    bottom: 0;
    width: 100vw;
    display: grid;
    place-content: center;
    height: 20vh;
  }

  button {
    background: transparent;
    color: white;
    font-weight: 200;
    font-size: 1rem;
  }
</style>
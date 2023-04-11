<script lang='ts'>

import { onMount } from 'svelte';
import { Canvas } from '@threlte/core'
import { World } from '@threlte/rapier'
import { frame, setFrame } from './stores/state'
import Scene from './components/scene.svelte'
import Stats from './components/stats.svelte'
import Debug from './components/debug.svelte'

let ready = false

onMount(() => {
  setTimeout(() => {
    if (window.localStorage.getItem('frame') === null) {
      const init = () => {
        setFrame('level_3')
        window.removeEventListener('keyup', init)
        window.removeEventListener('click', init)
      }

      window.addEventListener('keyup', init)
      window.addEventListener('click', init)
    }

    ready = true
  }, 500)
})

</script>

<Canvas useLegacyLights={false}>
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
    {#if ready}
      <button>
        begin
      </button>
    {/if}
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
    opacity: 0.3;
    cursor: default;
    margin-top: -26px;
    color: white;
    font-size: 10rem;
    font-weight: 100;
    font-family: system-ui, sans-serif;
    letter-spacing: 30px;
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
    opacity: 0.3;
    background: transparent;
    color: white;
    font-weight: 200;
    font-size: 1.2rem;
  }
</style>
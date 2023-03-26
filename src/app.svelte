<script lang='ts'>
  import { Canvas } from '@threlte/core'
  import { World } from '@threlte/rapier'
  import Scene from './scene.svelte'

  let state = 'title'
</script>

<Canvas>
  <World>
    <Scene {state} />
    <div slot='fallback'>
      Your browser does not support WASM. Please use a modern browser.
    </div>
  </World>
</Canvas>

{#if state === 'title'}
  <header>
    <h1>odyssey</h1>
  </header>

  <section>
    <button on:click={() => (state = 'game')}>
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
    color: white;
    font-weight: 200;
    font-size: 1rem;
  }
</style>
<script lang='ts'>

import { setFrame } from '../stores/state'

let ready = false

const init = (event: Event) => {
  if ((event as KeyboardEvent).key === 'Escape') return

  setFrame('level_3')
}

</script>

<svelte:window
  on:keyup|passive|once={init}
  on:click|passive|once={init}
/>

<header class='absolute top-0 left-0 w-full h-full grid place-content-center'>
  <h1 class='cursor-default text-white text-9xl font-extralight font-sans opacity-30'>odyssey</h1>
</header>

<article class='z-10 absolute bottom-0 w-full grid place-content-center h-[20vh]'>
  {#if ready}
    <button class='text-white font-extralight text-xl opacity-30'>
      begin
    </button>
  {/if}
</article>

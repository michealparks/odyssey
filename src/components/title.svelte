<script lang='ts'>

import { onMount } from 'svelte'
import { frame, gameState } from '../stores/state'
import { useProgress } from '@threlte/extras'

const { progress } = useProgress()

let ready = false

const init = (event: Event) => {
  if (!ready && $progress < 1) return
  if ((event as KeyboardEvent).key === 'Escape') return

  $frame = 'level_3'
  $gameState = 'awoken'
}

onMount(() => setTimeout(() => (ready = true), 1500))

</script>

<svelte:window
  on:keyup|passive|once={$gameState === 'intro' ? init : undefined}
  on:click|passive|once={$gameState === 'intro' ? init : undefined}
/>

<header class='absolute top-0 left-0 w-full h-full grid place-content-center'>
  <h1 class='cursor-default text-white text-9xl font-extralight font-sans opacity-50 text-center'>odyssey</h1>
  {#if $gameState === 'end'}
    <article class='z-10 w-full grid text-center place-content-center h-[20vh] text-white opacity-50 text-lg'>
      A mini-game by Micheal Parks.
      Made for Svelte Hack 2023.
    </article>
  {/if}
</header>

{#if $gameState !== 'end'}
  <article class='z-10 absolute bottom-0 w-full grid place-content-center h-[20vh]'>
    <button class='text-white font-extralight text-xl opacity-30'>
      {$progress === 1 && ready ? 'begin' : `${$progress * 100}%`}
    </button>
  </article>
{/if}

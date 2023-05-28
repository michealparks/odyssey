<script lang='ts'>

import { createEventDispatcher } from 'svelte'
import { HTML } from '@threlte/extras'

export let options: string[] = []
export let labels: string[] = []

const dispatch = createEventDispatcher()

</script>

<HTML
  sprite
  {...$$restProps}
>
  <ul class='grid gap-1 font-mono m-0'>
    {#each options as option, i (option)}
      <li
        class='flex items-center gap-1 px-1.5 text-white backdrop-blur border border-[rgba(255,255,255,0.6)] rounded-[3px]'
        on:click={() => dispatch('click', option)}
      >
        {#if labels[i] === undefined}
          {option}
        {:else}
        <span class='min-w-[0.5rem] text-center'>{option}</span>
        <span class='h-full border-l border-[rgba(255,255,255,0.6)]' />
        <span>{labels[i]}</span>
        {/if}
      </li>
    {/each}
  </ul>
</HTML>

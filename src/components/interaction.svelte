<script lang='ts'>

import { HTML } from '@threlte/extras'

export let options: string[] = []
export let labels: string[] = []

</script>

<HTML
  sprite
  {...$$restProps}
>
  <ul>
    {#each options as option, i (option)}
      {#if labels[i] === undefined}
        <li class='one'>{option}</li>
      {:else}
        <li class='two'>
          <span>{option}</span>
          <span class="border-l border-l-white" />
          <span>{labels[i]}</span>
        </li>
      {/if}
    {/each}
  </ul>
</HTML>

<style>
  ul {
    display: grid;
    gap: 0.25rem;
    padding: 0.25rem;
    font-family: ui-monospace;
    border-radius: 3px;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: #666;
    color: #fff;
    border-radius: 3px;
    padding: 0.125rem;
  }
</style>

<script lang='ts'>

import { HTML } from '@threlte/extras'

interface Option {
  input: string
  effect?: string
  handler: () => void
}

export let options: Option[] = []

</script>

<HTML
  sprite
  {...$$restProps}
>
  <ul>
    {#each options as { input, effect } (input)}
      {#if effect === undefined}
        <li class='one'>{input}</li>
      {:else}
        <li class='two'>
          <span>{input}</span> <span>{effect}</span>
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
    background-color: white;
  }

  li.one,
  li.two span:first-child {
    background-color: #666;
    color: #eee;
    padding: 0.125rem;
    border-radius: 3px;
  }

  li.two span:last-child {
    margin: 0 0.5rem;
  }
</style>

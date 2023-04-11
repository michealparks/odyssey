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
          <span class="divider" />
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
    font-family: ui-monospace;
    border-radius: 3px;
    margin: 0;
  }

  .divider {
    height: 100%;
    border-left: 1px solid rgba(255,255,255,0.6);
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid rgba(255,255,255,0.6);
    backdrop-filter: blur(10px);
    color: #fff;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 13px;
  }

  span:first-child {
    min-width: 0.5rem;
    text-align: center;
  }
</style>

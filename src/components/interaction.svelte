<script lang="ts">
  import { HTML } from '@threlte/extras'

  interface Props {
    options?: string[]
    labels?: string[]
    [key: string]: any
    onClick: (option: string) => void
  }

  let { options = [], labels = [], onClick, ...rest }: Props = $props()
</script>

<HTML
  sprite
  {...rest}
>
  <ul class="grid gap-1 font-mono m-0">
    {#each options as option, i (option)}
      <button onclick={() => onClick(option)}>
        <li
          class="flex items-center gap-1 px-1.5 text-white backdrop-blur border border-[rgba(255,255,255,0.6)] rounded-[3px]"
        >
          {#if labels[i] === undefined}
            {option}
          {:else}
            <span class="min-w-[0.5rem] text-center">{option}</span>
            <span class="h-full border-l border-[rgba(255,255,255,0.6)]"></span>
            <span>{labels[i]}</span>
          {/if}
        </li>
      </button>
    {/each}
  </ul>
</HTML>

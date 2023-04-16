<script lang='ts'>

import { graphics, type GraphicsMode } from '../stores/settings'

let open = false
let options = ['performance', 'balanced', 'quality']

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return

  event.preventDefault()
  event.stopImmediatePropagation()

  open = !open
}

const handleInput = (event: Event) => {
  $graphics = (event.currentTarget as HTMLInputElement).value as GraphicsMode
}

</script>

<svelte:window on:keyup={handleKeyUp} />

{#if open}
  <section class='absolute top-0 left-0 w-screen h-screen z-20 bg-black bg-opacity-60 p-14 text-white'>
    <h1 class='text-3xl font-extralight pb-8'>Odyssey</h1>

    <fieldset>
      <legend>Graphics:</legend>

      {#each options as option (option)}
        <div class='flex items-center gap-2'>
          <input
            type='radio'
            id={option}
            name='graphics'
            value={option}
            checked={$graphics === option}
            on:input={handleInput}
          >
          <label class='capitalize' for={option}>{option}</label>
        </div>
      {/each}
    </fieldset>
  </section>
{/if}

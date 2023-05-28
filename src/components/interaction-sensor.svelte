<script lang='ts'>

import { T } from '@threlte/core'
import { Collider, type ColliderShapes } from '@threlte/rapier'
import Interaction from './interaction.svelte'
import { createEventDispatcher } from 'svelte'

export let visible = true
export let enabled = true
export let shape: ColliderShapes
export let options: string[]
export let labels: string[]
export let args:
  [radius: number] |
  [halfHeight: number, radius: number] |
  [halfHeight: number, halfWidth: number, halfLength: number]

let entered = false

const dispatch = createEventDispatcher()

const handleKeydown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()

  if (options.includes(key)) dispatch('interact', key)
}

const handleEnter = () => {
  entered = true
  dispatch('enter')
}

const handleExit = () => {
  entered = false
  dispatch('exit')
}

</script>

<svelte:window on:keydown={entered ? handleKeydown : null} />

<T.Group {visible} {...$$restProps}>
  <Collider
    sensor
    {shape}
    {args}
    on:sensorenter={enabled ? handleEnter : null}
    on:sensorexit={enabled ? handleExit : null}
  />

  {#if entered && visible}
    <Interaction
      {options}
      {labels}
      on:click={(option) => dispatch('interact', option.detail)}
    />
  {/if}
</T.Group>

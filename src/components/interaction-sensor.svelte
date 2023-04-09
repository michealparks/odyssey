<script lang='ts'>

import { Collider, type ColliderShapes } from '@threlte/rapier'
import Interaction from './interaction.svelte'
import { createEventDispatcher, onDestroy } from 'svelte'

export let shape: ColliderShapes
export let options: string[]
export let labels: string[]
export let args:
  [radius: number] |
  [halfHeight: number, radius: number] |
  [halfHeight: number, halfWidth: number, halfLength: number]
export let position: [x: number, y: number, z: number] = [0, 0, 0]

let entered = false

const dispatch = createEventDispatcher()

const handleKeydown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()

  if (options.includes(key)) dispatch('interact', key)
}

const handleEnter = () => {
  entered = true
  window.addEventListener('keydown', handleKeydown, { passive: true })
  dispatch('enter')
}

const handleExit = () => {
  entered = false
  window.removeEventListener('keydown', handleKeydown)
  dispatch('exit')
}

onDestroy(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>

<Collider
  {shape}
  {args}
  {position}
  sensor
  on:sensorenter={handleEnter}
  on:sensorexit={handleExit}
>
  {#if entered}
    <Interaction {options} {labels} />
  {/if}
</Collider>
 
<script lang='ts'>

import { Collider, type ColliderShapes } from '@threlte/rapier'
import Interaction from './interaction.svelte'
import { createEventDispatcher } from 'svelte'

interface Option {
  input: string
  key?: string
  effect?: string
  handler: () => void
}

export let shape: ColliderShapes
export let options: Option[]
export let args:
  [radius: number] |
  [halfHeight: number, radius: number] |
  [halfHeight: number, halfWidth: number, halfLength: number]
export let position: [x: number, y: number, z: number] = [0, 0, 0]

let entered = false

const dispatch = createEventDispatcher()

const handleKeydown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  for (let option of options) {
    if (option.key === key || option.input.toLowerCase() === key) {
      option.handler()
      break
    }
  }
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
    <Interaction options={options} />
  {/if}
</Collider>
 
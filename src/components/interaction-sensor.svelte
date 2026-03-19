<script lang="ts">
  import { T } from '@threlte/core'
  import { Collider, type ColliderShapes } from '@threlte/rapier'
  import Interaction from './interaction.svelte'

  interface Props {
    visible?: boolean
    enabled?: boolean
    shape?: ColliderShapes
    options: string[]
    labels: string[]
    args:
      | [radius: number]
      | [halfHeight: number, radius: number]
      | [halfHeight: number, halfWidth: number, halfLength: number]
    [key: string]: any
    onEnter?: () => void
    onExit?: () => void
    onInteract?: (key: string) => void
  }

  let {
    visible = true,
    enabled = true,
    shape = 'cuboid',
    options,
    labels,
    args,
    onEnter,
    onExit,
    onInteract,
    ...rest
  }: Props = $props()

  let entered = $state(false)

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()

    if (options.includes(key)) onInteract?.(key)
  }

  const handleEnter = () => {
    entered = true
    onEnter?.()
  }

  const handleExit = () => {
    entered = false
    onExit?.()
  }
</script>

<svelte:window onkeydown={entered ? handleKeydown : null} />

<T.Group
  {visible}
  {...rest}
>
  {#if enabled}
    <Collider
      sensor
      {shape}
      {args}
      onsensorenter={handleEnter}
      onsensorexit={handleExit}
    />
  {/if}

  {#if entered && visible}
    <Interaction
      {options}
      {labels}
      onClick={(option) => onInteract?.(option)}
    />
  {/if}
</T.Group>

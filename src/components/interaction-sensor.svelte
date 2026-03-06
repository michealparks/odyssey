<script lang="ts">
  import { T } from "@threlte/core";
  import { Collider, type ColliderShapes } from "@threlte/rapier";
  import Interaction from "./interaction.svelte";

  export let visible = true;
  export let enabled = true;
  export let shape: ColliderShapes;
  export let options: string[];
  export let labels: string[];
  export let args:
    | [radius: number]
    | [halfHeight: number, radius: number]
    | [halfHeight: number, halfWidth: number, halfLength: number];
  export let onInteract: (key: string) => void;
  export let onEnter: (() => void) | undefined = undefined;
  export let onExit: (() => void) | undefined = undefined;

  let entered = false;

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (options.includes(key)) onInteract(key);
  };

  const handleEnter = () => {
    entered = true;
    onEnter?.();
  };

  const handleExit = () => {
    entered = false;
    onExit?.();
  };
</script>

<svelte:window onkeydown={entered ? handleKeydown : null} />

<T.Group {visible} {...$$restProps}>
  <Collider
    sensor
    {shape}
    {args}
    onsensorenter={enabled ? handleEnter : () => null}
    onsensorexit={enabled ? handleExit : () => null}
  />

  {#if entered && visible}
    <Interaction {options} {labels} onClick={(option) => onInteract(option)} />
  {/if}
</T.Group>

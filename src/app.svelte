<script lang='ts'>
  import { Canvas } from '@threlte/core'
  import { World } from '@threlte/rapier'
  import Scene from './scene.svelte'
</script>

<Canvas>
  <World>
    <Scene />
    <div slot='fallback'>
      World failed to load :(
    </div>
  </World>
</Canvas>

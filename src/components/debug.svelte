<script lang="ts">
  import { Debug } from '@threlte/rapier'

  const physicsDebug = false
</script>

{#if physicsDebug}
  <Debug
    depthTest={true}
    depthWrite={true}
  />
{/if}

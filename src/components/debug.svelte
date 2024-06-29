<script lang="ts">
  import { Debug } from "@threlte/rapier";
  import { Inspector } from "three-inspect";
  import { storage } from "../lib/storage";

  const debug = storage("debug") === "true";
  const physicsDebug = storage("debug_physics") === "true";

  let depth = true;
</script>

{#if debug}
  <Inspector />
{/if}

{#if physicsDebug}
  <Debug depthTest={depth} depthWrite={depth} />
{/if}

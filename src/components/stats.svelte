<script lang='ts'>

import { onDestroy, onMount } from 'svelte';
import Stats from 'three/examples/jsm/libs/stats.module'
import { useFrame } from '@threlte/core';

const stats = new Stats()
const v = useFrame(() => stats.update())
v.stop()

onMount(() => {
  v.start()
  document.body.append(stats.dom)
})

onDestroy(() => {
  v.stop()
  stats.dom.remove()
})

</script>

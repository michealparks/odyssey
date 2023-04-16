<script lang='ts'>

import { onDestroy, onMount } from 'svelte'
import Stats from 'three/examples/jsm/libs/stats.module'
import { useFrame } from '@threlte/core'

const stats = new Stats()
const { start, stop } = useFrame(() => stats.update(), { autostart: false })

onMount(() => {
  document.body.append(stats.dom)
  start()
})

onDestroy(() => {
  stop()
  stats.dom.remove()
})

</script>

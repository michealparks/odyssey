<script lang='ts'>

import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { onDestroy, onMount } from 'svelte'
import { useThrelte, useFrame } from '@threlte/core'
import { Debug } from '@threlte/rapier'
import Inspector from 'three-inspect'

import { storage } from '../lib/storage'

const stats = new Stats()
const { start, stop } = useFrame(() => stats.update(), { autostart: false })

const debug = storage('debug') === 'true'
const physicsDebug = storage('debug_physics') === 'true'

const { scene, camera, renderer } = useThrelte()

let depth = true

onMount(() => {
  document.body.append(stats.dom)
  start()

  if (debug) {
    new Inspector({
      scene,
      camera: camera.current as THREE.PerspectiveCamera,
      renderer: renderer!,
      options: { location: 'overlay' }
    })
  }
})

onDestroy(() => {
  stop()
  stats.dom.remove()
})

</script>

{#if physicsDebug}
  <Debug depthTest={depth} depthWrite={depth} />
{/if}

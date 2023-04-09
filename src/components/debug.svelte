<script lang='ts'>

import * as THREE from 'three'
import { Debug } from '@threlte/rapier'
import Inspector from 'three-inspect'
import { useThrelte } from '@threlte/core'

const physicsDebug = localStorage.getItem('debug_physics') === 'true'

const { scene, camera, renderer } = useThrelte()

if (localStorage.getItem('debug') === 'true') {
  new Inspector({
    THREE,
    scene,
    camera: camera.current as THREE.PerspectiveCamera,
    renderer,
    options: { location: 'overlay' }
  })
}

</script>

{#if physicsDebug}
  <Debug />
{/if}

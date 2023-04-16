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
    renderer: renderer!,
    options: { location: 'overlay' }
  })
}

let depth = true

</script>

{#if physicsDebug}
  <Debug depthTest={depth} depthWrite={depth} />
{/if}

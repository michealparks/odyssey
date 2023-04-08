<script lang='ts'>

import * as THREE from 'three'
import { softShadows } from 'trzy'
import { T, useThrelte } from '@threlte/core'
import { interactivity } from '@threlte/extras'
import { Debug } from '@threlte/rapier'
import Box from './box.svelte'
import Stars from './stars.svelte'
import Ship from './models/ship.svelte'
import Player from './models/player.svelte'
import { cameraPosition, cameraRotation } from '../stores/state'
import Inspector from 'three-inspect'
import { onMount } from 'svelte';

softShadows()

interactivity()

const { scene, camera, renderer } = useThrelte()

renderer.useLegacyLights = false

const physicsDebug = localStorage['debug_physics'] === 'true'

onMount(() => {
  if (localStorage.getItem('debug') === 'true') {
    new Inspector({
      THREE,
      scene,
      camera: camera.current as THREE.PerspectiveCamera,
      renderer,
      options: { location: 'overlay' }
    })
  }
})

</script>

<T.PerspectiveCamera
  makeDefault
  position={$cameraPosition}
  rotation={$cameraRotation}
  near={0.1}
  far={2500}
  on:create={({ ref }) => ref.lookAt(0, 1, 0)}
/>

<T.DirectionalLight
  castShadow
  intensity={1.1}
  position={[-3.4, 8, 4.3]}
  on:create={({ ref }) => {
    const { shadow } = ref
    shadow.mapSize.set(2048, 2048)
    shadow.camera.left = -10
    shadow.camera.right = 10
    shadow.camera.top = 10
    shadow.camera.bottom = -10
    shadow.camera.far = 20
    shadow.camera.near = 0.1
    shadow.camera.updateProjectionMatrix()
  }}
/>

<T.AmbientLight
  intensity={0.5}
/>

{#each Array.from({ length: 10 }) as _, i}
  <Box />
{/each}

<!-- <Ground /> -->
<Stars position={[0, 0, -140]} />

<Player />
<Ship />

{#if physicsDebug}
  <Debug />
{/if}

<script lang='ts'>
  import * as THREE from 'three'
  import { T, useThrelte } from '@threlte/core'
  import { spring } from 'svelte/motion'
  import { interactivity } from '@threlte/extras'
  import { Debug } from '@threlte/rapier'
  import Ground from './ground.svelte'
  import Box from './box.svelte'
  import Stars from './stars.svelte'
  import Ship from './models/ship.svelte'
  import Inspector from 'three-inspect'

  interactivity()

  const { scene, camera, renderer } = useThrelte()

  const debug = true
  const physicsDebug = false

  if (debug) {
    new Inspector(THREE, scene, camera.current as THREE.PerspectiveCamera, renderer)
  }
</script>

<T.OrthographicCamera
  position={[5, 10, 10]}
  zoom={7}
  near={-200}
  far={300}
  on:create={({ ref }) => ref.lookAt(0, 1, 0)}
/>

<T.PerspectiveCamera
  makeDefault
  manual
  position={[12, 20, 12]}
  near={0.1}
  far={2500}
  on:create={({ ref }) => ref.lookAt(0, 1, 0)}
/>

<T.DirectionalLight
  castShadow
  intensity={0.5}
  position={[3, 10, 7]}
/>

<T.AmbientLight
  intensity={0.2}
/>

<T.Fog far={100} />

{#each Array.from({ length: 50 }) as item, i}
  <Box />
{/each}

<!-- <Ground /> -->
<Stars position={[0, 0, -140]} />

<Ship />

{#if physicsDebug}
  <Debug />
{/if}

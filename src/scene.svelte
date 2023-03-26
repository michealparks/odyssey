<script lang='ts'>
  import * as THREE from 'three'
  import { T, useThrelte } from '@threlte/core'
  import { spring } from 'svelte/motion'
  import { interactivity } from '@threlte/extras'
  import { Debug } from '@threlte/rapier'
  import Ground from './components/ground.svelte'
  import Box from './components/box.svelte'
  import Stars from './components/stars.svelte'
  import Ship from './models/ship.svelte'
  import Inspector from 'three-inspect'

  export let state = 'title'

  interactivity()

  const { scene, camera, renderer } = useThrelte()

  const debug = false
  const physicsDebug = false

  if (debug) {
    new Inspector({
      THREE,
      scene,
      camera: camera.current as THREE.PerspectiveCamera,
      renderer,
      options: {
        location: 'overlay',
      },
    })
  }

  const posCamstart = [0, 0, 57]
  const rotCamstart = [0, 0, 0]
  const posCamgame = [0, 18, 24]
  const rotCamgame = [-0.6, 0, 0]

  const stiffness = 0.02
  const damping = 0.9
  const pos = spring(state === 'title' ? [...posCamstart] : [...posCamgame], { stiffness, damping })
  const rot = spring(state === 'title' ? [...rotCamstart] : [...rotCamgame], { stiffness, damping })

  $: {
    if (state === 'title') {
      pos.set([...posCamstart])
      rot.set([...rotCamstart])
    } else if (state === 'game') {
      pos.set([...posCamgame])
      rot.set([...rotCamgame])
    }
  }
</script>

<T.PerspectiveCamera
  makeDefault
  position={$pos}
  rotation={$rot}
  near={0.1}
  far={2500}
  on:create={({ ref }) => ref.lookAt(0, 1, 0)}
/>

<T.DirectionalLight
  castShadow
  intensity={0.25}
  position={[3, 10, 7]}
/>

<T.AmbientLight
  intensity={0.15}
/>

{#each Array.from({ length: 1 }) as item, i}
  <Box />
{/each}

<!-- <Ground /> -->
<Stars position={[0, 0, -140]} />

<Ship />

{#if physicsDebug}
  <Debug />
{/if}

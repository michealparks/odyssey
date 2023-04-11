<script lang='ts'>

import { softShadows } from 'trzy'
import { T, useThrelte } from '@threlte/core'
import { interactivity } from '@threlte/extras'
import Stars from './stars.svelte'
import Ship from './models/ship.svelte'
import Player from './models/player.svelte'
import { cameraPosition, cameraRotation, frame } from '../stores/state'
import { graphics } from '../stores/settings'

softShadows()

interactivity()

const { renderer } = useThrelte()

if (renderer) renderer.useLegacyLights = false

window.addEventListener('resize', () => {
  if (renderer) renderer.useLegacyLights = false
}, { passive: true })

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
    const size = $graphics === 'performance' ? 2 ** 10 : 2 ** 12
    shadow.mapSize.set(size, size)

    const cam = shadow.camera
    cam.left = -10
    cam.right = 10
    cam.top = 10
    cam.bottom = -10
    cam.far = 20
    cam.near = 0.2
    cam.updateProjectionMatrix()
  }}
/>

<T.AmbientLight
  intensity={0.5}
/>

<Stars />

{#if $frame !== 'title'}
  <Player />
{/if}

<Ship />

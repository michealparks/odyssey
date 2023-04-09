<script lang='ts'>

import { softShadows } from 'trzy'
import { T, useThrelte } from '@threlte/core'
import { interactivity } from '@threlte/extras'
import Box from './box.svelte'
import Stars from './stars.svelte'
import Ship from './models/ship.svelte'
import Player from './models/player.svelte'
import { cameraPosition, cameraRotation } from '../stores/state'
import { graphics } from '../stores/settings'

softShadows()

interactivity()

const { renderer } = useThrelte()

renderer!.useLegacyLights = false

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
  shadow.camera.width={2048}
  shadow.camera.height={2048}
  on:create={({ ref }) => {
    const { shadow } = ref
    const size = $graphics === 'performance' ? 2 ** 10 : 2 ** 12
    shadow.mapSize.set(size, size)
    shadow.camera.left = -10
    shadow.camera.right = 10
    shadow.camera.top = 10
    shadow.camera.bottom = -10
    shadow.camera.far = 20
    shadow.camera.near = 0.2
    shadow.camera.updateProjectionMatrix()
  }}
/>

<T.AmbientLight
  intensity={0.5}
/>

{#each Array.from({ length: 10 }) as _, i}
  <Box />
{/each}

<Stars position={[0, 0, -140]} />

<Player />
<Ship />

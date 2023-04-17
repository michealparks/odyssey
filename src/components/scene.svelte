<script lang='ts'>

import { T, useThrelte } from '@threlte/core'
import Stars from './stars.svelte'
import Ship from './ship/index.svelte'
import Player from './player/index.svelte'
import Lights from './lights.svelte'
import { cameraPosition, cameraRotation } from '../stores/state'
import { softShadows, resetSoftShadows } from 'trzy'

const { renderer, scene, camera } = useThrelte()

renderer!.debug.checkShaderErrors = import.meta.env.DEV

softShadows()
resetSoftShadows(renderer!, scene, $camera)

</script>

<T.PerspectiveCamera
  makeDefault
  position={$cameraPosition}
  rotation={$cameraRotation}
  near={0.1}
  far={2500}
/>

<Stars />
<Player />
<Ship />
<Lights />
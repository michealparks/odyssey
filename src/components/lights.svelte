<script lang='ts'>

import { graphics } from '../stores/settings'
import { T } from '@threlte/core'
import { useThrelte } from '@threlte/core'

const { scene } = useThrelte()

$: mapSize = $graphics === 'performance'
  ? 2 ** 9
  : $graphics === 'balanced'
  ? 2 ** 10
  : 2 ** 12

$: {
  const light = scene.getObjectByName('directional') as THREE.DirectionalLight | undefined

  if (light !== undefined) {
    light.shadow.mapSize.set(mapSize, mapSize)
    light.shadow.dispose()
    light.shadow.map = null
    light.shadow.needsUpdate = true
  }
}

</script>

<T.DirectionalLight
  name='directional'
  castShadow
  intensity={1.3}
  position={[-3.4, 8, 4.3]}
  on:create={({ ref }) => {
    const { shadow } = ref
    shadow.mapSize.set(mapSize, mapSize)

    const { camera } = shadow
    const size = 10
    camera.left = -size
    camera.right = size
    camera.top = size
    camera.bottom = -size
    camera.far = 20
    camera.near = 0.2
    camera.updateProjectionMatrix()
  }}
/>

<T.AmbientLight
  intensity={0.6}
/>

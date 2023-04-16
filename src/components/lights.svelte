<script lang='ts'>

import { graphics } from '../stores/settings'
import { T } from '@threlte/core'

</script>

<T.DirectionalLight
  castShadow
  intensity={1.3}
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
  intensity={0.6}
/>

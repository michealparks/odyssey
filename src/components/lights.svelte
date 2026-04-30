<script lang="ts">
  import { graphics } from '../stores/settings'
  import { T } from '@threlte/core'
  import { DirectionalLight } from 'three'

  let mapSize = $derived(
    {
      performance: 2 ** 9,
      balanced: 2 ** 10,
      quality: 2 ** 16,
    }[$graphics]
  )

  const light = new DirectionalLight()
  const size = 10

  light.shadow.dispose()
  light.shadow.map = null
  light.shadow.needsUpdate = true

  $effect(() => {
    light.shadow.mapSize.set(mapSize, mapSize)
  })
</script>

<T
  is={light}
  castShadow
  intensity={1.5}
  position={[-3.4, 8, 4.3]}
  shadow.camera.left={-size}
  shadow.camera.right={size}
  shadow.camera.top={size}
  shadow.camera.bottom={-size}
  shadow.camera.far={20}
  shadow.camera.near={0.2}
/>

<T.AmbientLight intensity={0.5} />

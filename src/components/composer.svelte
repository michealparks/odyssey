<script lang='ts'>

import { useThrelte, useRender } from '@threlte/core'
import { initBloomEffect } from '../lib/bloom'
import * as POST from 'postprocessing'

const { scene, renderer, camera } = useThrelte()

const composer = new POST.EffectComposer(renderer)

const setupEffectComposer = (camera: THREE.Camera) => {
  composer.removeAllPasses()
  composer.addPass(new POST.RenderPass(scene, camera))

  composer.addPass(
    new POST.EffectPass(
      camera,
      initBloomEffect(scene, camera),
      new POST.SMAAEffect({ preset: POST.SMAAPreset.LOW })
    )
  )
}
// We need to set up the passes according to the camera in use
$: setupEffectComposer($camera)

useRender((_, delta) => composer.render(delta))

</script>

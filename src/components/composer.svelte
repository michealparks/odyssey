<script lang="ts">
  import { useThrelte, useTask } from '@threlte/core'
  import { initBloomEffect } from '../lib/bloom'
  import {
    EffectComposer,
    RenderPass,
    EffectPass,
    SMAAEffect,
    SMAAPreset,
  } from 'postprocessing'
  import type { Camera } from 'three'

  const { scene, renderer, camera, autoRender, renderStage } = useThrelte()

  const composer = new EffectComposer(renderer)

  const setupEffectComposer = (camera: Camera) => {
    composer.removeAllPasses()
    composer.addPass(new RenderPass(scene, camera))

    composer.addPass(
      new EffectPass(
        camera,
        initBloomEffect(scene, camera),
        new SMAAEffect({ preset: SMAAPreset.LOW })
      )
    )
  }
  // We need to set up the passes according to the camera in use
  $effect(() => {
    autoRender.set(false)
    setupEffectComposer($camera)
  })

  useTask(
    (delta) => {
      composer.render(delta)
    },
    { stage: renderStage }
  )
</script>

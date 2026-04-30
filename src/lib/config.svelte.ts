import * as THREE from 'three'
import { isInstanceOf, useThrelte } from '@threlte/core'
import { cameraPosition } from '../stores/state'
import { fromStore } from 'svelte/store'

export const configure = () => {
  const { renderer, scene, camera: cameraStore } = useThrelte()
  const camera = fromStore(cameraStore)

  if (
    isInstanceOf(camera.current, 'PerspectiveCamera')  ||
    isInstanceOf(camera.current, 'OrthographicCamera')
  ) {
    camera.current.near = 2
    camera.current.far = 2500
    camera.current.updateProjectionMatrix()
  }

  $effect(() => {
    camera.current.position.fromArray(cameraPosition.current)
  })

  renderer.debug.checkShaderErrors = import.meta.env.DEV

  scene.fog = new THREE.Fog(0x000000, 1, 100)
}

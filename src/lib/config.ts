import * as THREE from 'three'
import { useThrelte } from '@threlte/core'
import { cameraPosition } from '../stores/state'

export const configure = () => {
  const { renderer, scene, camera } = useThrelte()

  const cam = camera.current as THREE.PerspectiveCamera
  cam.near = 2
  cam.far = 2500
  cameraPosition.subscribe(update => {
    cam.position.set(update[0], update[1], update[2])
  })

  renderer.debug.checkShaderErrors = import.meta.env.DEV

  scene.fog = new THREE.Fog(0x000000, 1, 100)
}

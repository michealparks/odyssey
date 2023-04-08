import * as THREE from 'three'
import { useThrelte } from '@threlte/core'

const near = 10
const far = 2000
const size = 512
const fps = 40

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(size)
const mirrorSphereCamera = new THREE.CubeCamera(near, far, cubeRenderTarget)
const target = mirrorSphereCamera.renderTarget
target.stencilBuffer = false
target.depthBuffer = false
target.setSize(512, 512)

let started = false

const start = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  setInterval(() => {
    if (!renderer || !scene) return
  
    mirrorSphereCamera.update(renderer, scene)
  }, 1000 / fps)

  scene.add(mirrorSphereCamera)
  
  started = true
}

export const useReflectionTexture = () => {
  if (!started) {
    const { scene, renderer } = useThrelte()
    start(scene, renderer)
  }

  return cubeRenderTarget.texture
}

import * as THREE from 'three'

const near = 10
const far = 2000
const size = 256

const target = new THREE.WebGLCubeRenderTarget(size)
const camera = new THREE.CubeCamera(near, far, target)
target.stencilBuffer = false
target.depthBuffer = false

export const reflection = {
  camera,
  target,
  texture: target.texture,
  update: (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
    camera.update(renderer, scene)
  }
}

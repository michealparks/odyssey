import {
  KernelSize,
  BlendFunction,
  SelectiveBloomEffect,
} from 'postprocessing'
import type { Camera, Object3D, Scene } from 'three'

export let bloomEffect: SelectiveBloomEffect

let didInit = false
let queue: Object3D[] = []

export const initBloomEffect = (scene: Scene, camera: Camera) => {
  bloomEffect = new SelectiveBloomEffect(scene, camera, {
    intensity: 0.2,
    luminanceThreshold: 0,
    height: 512,
    width: 512,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
    kernelSize: KernelSize.MEDIUM,
    blendFunction: BlendFunction.ADD,
  })
  // bloomEffect.inverted = true

  didInit = true

  queue.forEach((object) => addToBloom(object))

  return bloomEffect
}

export const addToBloom = (object: Object3D) => {
  if (!didInit) {
    queue.push(object)
    return
  }

  bloomEffect.selection.toggle(object)
}

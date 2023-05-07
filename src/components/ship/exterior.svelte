<script lang='ts'>

import * as THREE from 'three'
import { useGltf } from '@threlte/extras'
import { T, useFrame, useThrelte } from '@threlte/core'
import { level } from '../../stores/state'
import { addToBloom } from '../../lib/bloom'

interface GLTFResult {
  nodes: {
    exterior_top: THREE.Mesh
    exterior_middle_top: THREE.Mesh
    exterior_middle_bottom: THREE.Mesh
    exterior_bottom: THREE.Mesh
  }
  materials: {
    Exterior: THREE.MeshStandardMaterial
  }
}

const { renderer, scene } = useThrelte()

const near = 100
const far = 2500
const size = 512
const target = new THREE.WebGLCubeRenderTarget(size, {
  // generateMipmaps: true,
  // minFilter: THREE.LinearMipmapLinearFilter,
  anisotropy: renderer?.capabilities.getMaxAnisotropy() ?? 1,
  stencilBuffer: false,
  depthBuffer: false,
})
const camera = new THREE.CubeCamera(near, far, target)
camera.name = 'Reflection Camera'
scene.add(camera)

const material = new THREE.MeshLambertMaterial({
  color: 0xbcbcbc,
  envMap: target.texture,
  reflectivity: 0.95,
})

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

useFrame(() => {
  // scene.traverse(obj => {
  //   if (obj.name === 'stars') {
  //     obj.visible = true
  //     return
  //   }
  
  //   obj.userData['visible'] = obj.visible
  //   obj.visible = false
  // })

  target.clear(renderer!, true, false, false)
  camera.update(renderer!, scene)

  // scene.traverse(obj => {
  //   if (obj.name === 'stars') return
  //   obj.visible = obj.userData['visible']
  // })
})

</script>

{#if $gltf}
  <T.Mesh
    name="exterior_top"
    geometry={$gltf.nodes.exterior_top.geometry}
    visible={$level > 3}
    {material}
    on:create={({ ref }) => addToBloom(ref)}
  />

  <T.Mesh
    name="exterior_middle_top"
    geometry={$gltf.nodes.exterior_middle_top.geometry}
    visible={$level > 2}
    {material}
    on:create={({ ref }) => addToBloom(ref)}
  />

  <T.Mesh
    name="exterior_middle_bottom"
    geometry={$gltf.nodes.exterior_middle_bottom.geometry}
    visible={$level > 1}
    {material}
    on:create={({ ref }) => addToBloom(ref)}
  />

  <T.Mesh
    name="exterior_bottom"
    geometry={$gltf.nodes.exterior_bottom.geometry}
    {material}
    on:create={({ ref }) => addToBloom(ref)}
  />
{/if}
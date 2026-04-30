<script lang="ts">
  import {
    type Mesh,
    type MeshStandardMaterial,
    WebGLCubeRenderTarget,
    CubeCamera,
    MeshLambertMaterial,
  } from 'three'
  import { useGltf } from '@threlte/extras'
  import { T, useTask, useThrelte } from '@threlte/core'
  import { level } from '../../stores/state'
  import { addToBloom } from '../../lib/bloom'

  interface GLTFResult {
    nodes: {
      exterior_top: Mesh
      exterior_middle_top: Mesh
      exterior_middle_bottom: Mesh
      exterior_bottom: Mesh
    }
    materials: {
      Exterior: MeshStandardMaterial
    }
  }

  const { renderer, scene } = useThrelte()

  const near = 100
  const far = 2500
  const size = 512
  const target = new WebGLCubeRenderTarget(size, {
    anisotropy: renderer.capabilities.getMaxAnisotropy(),
    stencilBuffer: false,
    depthBuffer: false,
  })
  const camera = new CubeCamera(near, far, target)
  camera.name = 'Reflection Camera'
  scene.add(camera)

  const material = new MeshLambertMaterial({
    color: 0xbcbcbc,
    envMap: target.texture,
    reflectivity: 0.95,
  })

  const gltf = useGltf<GLTFResult>(`${import.meta.env.BASE_URL}glb/ship.glb`)

  useTask(() => {
    target.clear(renderer, true, false, false)
    camera.update(renderer, scene)
  })
</script>

{#if $gltf}
  <T.Mesh
    name="exterior_top"
    geometry={$gltf.nodes.exterior_top.geometry}
    visible={$level > 3}
    {material}
    oncreate={(ref) => {
      addToBloom(ref)
    }}
  />

  <T.Mesh
    name="exterior_middle_top"
    geometry={$gltf.nodes.exterior_middle_top.geometry}
    visible={$level > 2}
    {material}
    oncreate={(ref) => {
      addToBloom(ref)
    }}
  />

  <T.Mesh
    name="exterior_middle_bottom"
    geometry={$gltf.nodes.exterior_middle_bottom.geometry}
    visible={$level > 1}
    {material}
    oncreate={(ref) => {
      addToBloom(ref)
    }}
  />

  <T.Mesh
    name="exterior_bottom"
    geometry={$gltf.nodes.exterior_bottom.geometry}
    {material}
    oncreate={(ref) => {
      addToBloom(ref)
    }}
  />
{/if}

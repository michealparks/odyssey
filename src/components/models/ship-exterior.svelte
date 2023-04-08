<script lang='ts'>

import { useGltf } from '@threlte/extras'
import { useReflectionTexture } from './hull-reflection'
import { T } from '@threlte/core'
import { level } from '../../stores/state'

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

const gltf = useGltf<GLTFResult>('./glb/ship.glb')
const reflectionTexture = useReflectionTexture()

const metalness = 0.9
const roughness = 0.05

</script>

{#if $gltf}
  <T.Mesh
    name="exterior_top"
    geometry={$gltf.nodes.exterior_top.geometry}
    visible={$level > 3}
  >
    <T
      is={$gltf.materials.Exterior}
      {metalness}
      {roughness}
      envMap={reflectionTexture}
      envMapIntensity={0.8}
    />
  </T.Mesh>

  <T.Mesh
    name="exterior_middle_top"
    geometry={$gltf.nodes.exterior_middle_top.geometry}
    visible={$level > 2}
  >
    <T
      is={$gltf.materials.Exterior}
      {metalness}
      {roughness}
      envMap={reflectionTexture}
      envMapIntensity={0.8}
    />
  </T.Mesh>

  <T.Mesh
    name="exterior_middle_bottom"
    geometry={$gltf.nodes.exterior_middle_bottom.geometry}
    visible={$level > 1}
  >
    <T
      is={$gltf.materials.Exterior}
      {metalness}
      {roughness}
      envMap={reflectionTexture}
      envMapIntensity={0.8}
    />
  </T.Mesh>

  <T.Mesh
    name="exterior_bottom"
    geometry={$gltf.nodes.exterior_bottom.geometry}
  >
    <T
      is={$gltf.materials.Exterior}
      {metalness}
      {roughness}
      envMap={reflectionTexture}
      envMapIntensity={0.8}
    />
  </T.Mesh>
{/if}
<script lang='ts'>

import * as THREE from 'three'
import { T, useFrame, useThrelte } from '@threlte/core'
import { useGltf } from '@threlte/extras'

export let visible = true

const { renderer } = useThrelte()

interface GLTFResult {
  nodes: {
    console_screen: THREE.Mesh
  }
  materials: {}
}

const width = 200
const height = 200
const gltf = useGltf<GLTFResult>('./glb/ship.glb')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
canvas.width = width
canvas.height = height
ctx.fillStyle = '#ffffff'
ctx.fillRect(0, 0, width, height)
const map = new THREE.CanvasTexture(canvas)
const material = new THREE.MeshStandardMaterial({ map })
material.side = THREE.FrontSide
map.wrapS = THREE.RepeatWrapping;
map.wrapT = THREE.RepeatWrapping;
map.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1

material.needsUpdate = true

const randInt = (min: number, max: number) => {
  return Math.random() * (max - min) + min | 0
}

const drawRandomDot = () => {
  for (let i = 0; i < 20; i += 1) {
    ctx.fillStyle = `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`
    const x = randInt(0, width)
    const y = randInt(0, height)
    ctx.fillRect(x, y, randInt(0, 50), randInt(0, 50))
    ctx.fill()
  }
}

useFrame(() => {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  drawRandomDot()
  map.needsUpdate = true
})

</script>

{#if $gltf}
  <T.Mesh
    name="console_screen"
    receiveShadow
    geometry={$gltf.nodes.console_screen.geometry}
    position={[4.94, 5.15, -0.09]}
    {material}
    {visible}
  />
{/if}

<T.Mesh position={[0, 5, 0]} {material}>
  <T.PlaneGeometry args={[2, 1]} />
</T.Mesh>
  

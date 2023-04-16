<script lang='ts'>

import * as THREE from 'three'
import { T, useFrame, useThrelte } from '@threlte/core'
import { useGltf, PositionalAudio } from '@threlte/extras'
import { frame, gameState } from '../../stores/state'
    import { tweened } from 'svelte/motion';

export let visible = false

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
const map = new THREE.CanvasTexture(canvas)
const material = new THREE.MeshStandardMaterial({ map })
material.side = THREE.FrontSide
map.wrapS = THREE.RepeatWrapping;
map.wrapT = THREE.RepeatWrapping;
map.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1

material.needsUpdate = true

const randInt = (min: number, max: number): number => {
  return Math.random() * (max - min) + min | 0
}

const drawRandomDot = (): void => {
  for (let i = 0; i < 20; i += 1) {
    ctx.fillStyle = `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`
    const x = randInt(0, width)
    const y = randInt(0, height)
    ctx.fillRect(x, y, randInt(0, 50), randInt(0, 50))
    ctx.fill()
  }
}

const { start, stop } = useFrame(() => {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, width, height)
  drawRandomDot()
  map.needsUpdate = true
}, { autostart: false })

$: visible ? start() : stop()

const volume = tweened(0, { duration: 500 })

$: $volume = $frame === 'level_3_console' ? 0.7 : 0

</script>

{#if $gltf}
  <T.Mesh
    name="console_screen"
    receiveShadow
    geometry={$gltf.nodes.console_screen.geometry}
    position={[4.94, 5.15, -0.09]}
    {material}
    {visible}
  >
    {#if $volume > 0}
    <PositionalAudio
      src={`/mp3/computer_${$gameState === 'initial' ? 'broken' : 'working'}.mp3`}
      refDistance={0.5}
      maxDistance={0.5}
      autoplay
      volume={$volume}
      loop
      directionalCone={{
        coneInnerAngle: 90,
        coneOuterAngle: 220,
        coneOuterGain: 0.3
      }}
    />
    {/if}
    <slot />
  </T.Mesh>
{/if}

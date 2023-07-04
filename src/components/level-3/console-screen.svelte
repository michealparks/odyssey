<script lang='ts'>

import * as THREE from 'three'
import { T, useFrame, useThrelte } from '@threlte/core'
import { useGltf, PositionalAudio } from '@threlte/extras'
import { frame, gameState } from '../../stores/state'
import { tweened } from 'svelte/motion'
    import { setStatic } from '../../lib/static';

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
material.needsUpdate = true
map.wrapS = THREE.RepeatWrapping
map.wrapT = THREE.RepeatWrapping
map.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1

const n = 20
const bubbles: { r: number, o: number, c: [r: number, g: number, b: number], x: number, y: number, dx: number, dy: number }[] = []

const volume = tweened(0, { duration: 500 })

const randInt = (min: number, max: number): number => {
  return Math.random() * (max - min) + min | 0
}

const drawNiceBubbles = () => {
  for (let i = 0; i < n; i += 1) {
    const bubble = bubbles[i]!
    ctx.fillStyle = `rgba(${bubble.c[0]},${bubble.c[1]},${bubble.c[2]},${bubble.o})`
    ctx.beginPath()
    ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI)
    ctx.fill()

    bubble.x += bubble.dx
    bubble.y += bubble.dy

    if (bubble.x > width || bubble.x < 0) bubble.dx = -bubble.dx
    if (bubble.y > height || bubble.y < 0) bubble.dy = -bubble.dy
  }
}

const drawRandomRect = (): void => {
  for (let i = 0; i < n; i += 1) {
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

  if ($gameState === 'fixedComputer' || $gameState === 'restoredSystems') {
    drawNiceBubbles()
  } else {
    drawRandomRect()
  }
  
  map.needsUpdate = true
}, { autostart: false })

$: visible ? start() : stop()

$: $volume = $frame === 'level_3_console' ? 0.7 : 0

for (let i = 0; i < n; i += 1) {
  bubbles.push({
    r: randInt(5, 35),
    x: randInt(0, width),
    y: randInt(0, height),
    o: (Math.random() * 0.5) + 0.5,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
    c: [randInt(0, 255), randInt(0, 255), randInt(0, 255)],
  })
}

</script>

{#if $gltf}
  <T.Mesh
    name="console_screen"
    receiveShadow
    geometry={$gltf.nodes.console_screen.geometry}
    position={[4.94, 5.15, -0.09]}
    {material}
    {visible}
    on:create={({ ref }) => setStatic(ref)}
  >
    {#if $volume > 0}
      <PositionalAudio
        src={`${import.meta.env.BASE_URL}mp3/computer_${$gameState === 'seeking' ? 'broken' : 'working'}.mp3`}
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

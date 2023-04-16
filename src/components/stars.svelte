<script lang='ts'>

import { T, useFrame } from '@threlte/core'
import * as THREE from 'three'
import { randomPointOnCircle } from '../lib/math'
import { shaderMaterial } from 'trzy'

const radius = 200
const length = 2500
const count = 5_000
const animatedCount = 3_000
const speeds = new Float32Array(count);
const geometry = new THREE.BufferGeometry()

const positionsAttribute = new THREE.BufferAttribute(new Float32Array(count * 3), 3)
const positionsArray = positionsAttribute.array as number[]
geometry.setAttribute('position', positionsAttribute)

const colorArray = new Float32Array(count)

for (let i = 0, j = 0; i < positionsArray.length; i += 3, j += 1) {
  const [x, y] = randomPointOnCircle(radius)

  positionsArray[i + 0] = x
  positionsArray[i + 1] = y
  positionsArray[i + 2] = (Math.random() * length) - (length / 2)

  speeds[j] = (Math.random() * 4)

  const grayscaleValue = Math.random() * 256 | 0
  colorArray[j] = grayscaleValue / 255

  if (j > animatedCount) {
    colorArray[j] /= 2
  }
}

const colorAttribute = new THREE.BufferAttribute(colorArray, 1)
geometry.setAttribute('color', colorAttribute)

const StarMaterial = shaderMaterial(
  {},
  `
    attribute float color;
    varying float vColor;

    void main() {
      float z = (position.z + 1250.0) / 2500.0;
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 2.0;
    }
  `,
  `
    varying float vColor;
    void main() {
      gl_FragColor = vec4(vColor, vColor, vColor, 1.0);
    }
  `)

const material = new StarMaterial()

useFrame(() => {
  for (let i = 0, j = 0, l = animatedCount * 3; i < l; i += 3, j += 1) {
    const val = positionsArray[i + 2]!
    if (val > length / 2) {
      positionsArray[i + 2] = -length / 2
    } else {
      positionsArray[i + 2] += speeds[j]!
    }
  }

  positionsAttribute.needsUpdate = true
})

</script>

<T.Points
  name='stars'
  {geometry}
  {material}
  position.z={-140}
>

</T.Points>

<script lang='ts'>
  import { T, useFrame } from '@threlte/core'
  import * as THREE from 'three';
  import { randomPointOnCircle } from '../lib/math'

  export let position: [x: number, y: number, z: number]

  let cursor = 0

  const radius = 200
  const length = 2500
  const count = 3_000
  const v = new Float32Array(count);
  const geometry = new THREE.BufferGeometry()
  const attribute = new THREE.BufferAttribute(new Float32Array(count * 3), 3)
  geometry.setAttribute('position', attribute);

  const init = () => {
    const p = attribute.array

    for (let i = 0, j = 0; i < p.length; i += 3, j += 1) {
      const start = Math.PI / 1.5
      const end = Math.PI * 3 / 2
      const [x, y] = randomPointOnCircle(radius)

      v[j] = (Math.random() * 3) + 1

      p[i + 0] = x
      p[i + 1] = y
      p[i + 2] = (Math.random() * length) - (length / 2)
    }
  }

  init()

  useFrame((_, delta) => {
    const { array } = attribute
  
    for (let i = 0, j = 0; i < array.length; i += 3, j += 1) {
      const val = array[i + 2]
      if (val > length / 2) {
        array[i + 2] = -length / 2
      } else {
        array[i + 2] += v[j]
      }
    }

    geometry.attributes.position.needsUpdate = true
  })
</script>

<T.Points
  name='stars'
  frustumCulled={false}

  {geometry}
  {position}
>
  <T.PointsMaterial
    size={1}
    color={0xffffff}
    sizeAttenuation={false}
  />
</T.Points>

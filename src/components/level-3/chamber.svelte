<script lang='ts'>

import * as THREE from 'three'
import { useGltf } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { T, useFrame, useThrelte } from '@threlte/core'
import { frame, gameState } from '../../stores/state'

interface GLTFResult {
  nodes: {
    stasis_chamber: THREE.Mesh
  }
  materials: {}
}

const { scene } = useThrelte()

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

$: visible = $frame.includes('level_3')

$: {
  if ($gameState === 'awoken') {
    // start()
    $gameState = 'seeking'
  }
}

const count = 16
const velocities = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i += 3) {
  velocities[i + 0] = (Math.random() - 0.5) * 0.01
  velocities[i + 1] = (Math.random() + 0.5) * 0.01
  velocities[i + 2] = Math.random() * 0.05
}

const mat4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()

const geo = new THREE.IcosahedronGeometry(0.1)
const mat = new THREE.MeshStandardMaterial({ color: '#fff' })
const mesh = new THREE.InstancedMesh(geo, mat, count)
scene.add(mesh)
mesh.position.set(0, 5.43, -4.32)

const { stop, start } = useFrame(() => {
  for (let i = 0, j = 0; i < count; i += 1, j += 3) {
    mesh.getMatrixAt(i, mat4)
    vec3.setFromMatrixPosition(mat4)
    vec3.set(vec3.x + velocities[j]!, vec3.y + velocities[j + 1]!, vec3.z + velocities[j + 2]!)
    mat4.setPosition(vec3)
    mesh.setMatrixAt(i, mat4)
  }
  mesh.instanceMatrix.needsUpdate = true
}, { autostart: false })

</script>

{#if $gltf}
  <T
    is={$gltf.nodes.stasis_chamber}
    castShadow
    receiveShadow
    {visible}
  >
    <Collider
      shape='roundCylinder'
      args={[1.3, 0.9, 0]}
    />
  </T>
{/if}

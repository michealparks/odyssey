<script lang='ts'>

import * as THREE from 'three'
import { Group } from 'three'
import type { ActionName } from './types'
import { T, type Events, type Slots } from '@threlte/core'
import { useGltf, useGltfAnimations } from '@threlte/extras'

type $$Events = Events<THREE.Group>
type $$Slots = Slots<THREE.Group>

type GLTFResult = {
  nodes: {
    Cylinder002: THREE.SkinnedMesh
    Cylinder002_1: THREE.SkinnedMesh
    Cylinder002_2: THREE.SkinnedMesh
    Cylinder002_3: THREE.SkinnedMesh
    Cylinder002_4: THREE.SkinnedMesh
    Cylinder002_5: THREE.SkinnedMesh
    Bone: THREE.Bone
  }
  materials: {
    Skin: THREE.MeshStandardMaterial
    Eyes: THREE.MeshStandardMaterial
    Hair: THREE.MeshStandardMaterial
    Shirt: THREE.MeshStandardMaterial
    Pants: THREE.MeshStandardMaterial
    Socks: THREE.MeshStandardMaterial
  }
}

export const ref = new Group()

export let action: ActionName = 'Man_Idle'

let previous: ActionName

const gltf = useGltf<GLTFResult>('./glb/male.glb')

export const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref)

let timeoutid = 0
let crossFading = false

$: {
  if ($actions[action]) {
    if (!previous) {
      $actions[action]!.play()
    } else if (previous !== action) {
      const previousAction = $actions[previous]!
      const currentAction = $actions[action]!

      currentAction.play()
      previousAction.crossFadeTo(currentAction, 0.1, false)

      if (timeoutid) clearTimeout(timeoutid)
      timeoutid = setTimeout(() => {
        previousAction.stop()
        crossFading = false
      }, 100)
    }

    previous = action
  }
}

</script>

{#if $gltf}
  <T
    is={ref}
    dispose={false}
    {...$$restProps}
    name='Male'
    scale={0.4}
  >
    <T is={$gltf.nodes.Bone} />
    <T.SkinnedMesh
      name='Skin'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002.geometry}
      material={$gltf.materials.Skin}
      skeleton={$gltf.nodes.Cylinder002.skeleton}
    />
    <T.SkinnedMesh
      name='Feet'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_1.geometry}
      material={$gltf.materials.Eyes}
      skeleton={$gltf.nodes.Cylinder002_1.skeleton}
    />
    <T.SkinnedMesh
      name='Hair'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_2.geometry}
      material={$gltf.materials.Hair}
      skeleton={$gltf.nodes.Cylinder002_2.skeleton}
    />
    <T.SkinnedMesh
      name='Shirt'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_3.geometry}
      material={$gltf.materials.Shirt}
      skeleton={$gltf.nodes.Cylinder002_3.skeleton}
    />
    <T.SkinnedMesh
      name='Pants'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_4.geometry}
      material={$gltf.materials.Pants}
      skeleton={$gltf.nodes.Cylinder002_4.skeleton}
    />
    <T.SkinnedMesh
      name='Socks'
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_5.geometry}
      material={$gltf.materials.Socks}
      skeleton={$gltf.nodes.Cylinder002_5.skeleton}
    />
    <slot {ref} />
  </T>
{/if}
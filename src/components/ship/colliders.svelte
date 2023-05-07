<script lang="ts">

import type * as THREE from 'three'
import { AutoColliders } from '@threlte/rapier'
import { T } from '@threlte/core'
import { useGltf } from '@threlte/extras'

interface GLTFResult {
  nodes: {
    outer_collider_3_1: THREE.Mesh
    outer_collider_3_2: THREE.Mesh
    outer_collider_3_3: THREE.Mesh
    outer_collider_3_4: THREE.Mesh
    outer_collider_3_5: THREE.Mesh
    outer_collider_3_6: THREE.Mesh
    outer_collider_3_7: THREE.Mesh
    outer_collider_3_8: THREE.Mesh
    outer_collider_3_9: THREE.Mesh
    outer_collider_3_10: THREE.Mesh
    outer_collider_3_11: THREE.Mesh
    outer_collider_3_12: THREE.Mesh
    outer_collider_3_13: THREE.Mesh
    outer_collider_3_14: THREE.Mesh
    outer_collider_3_15: THREE.Mesh
    outer_collider_3_16: THREE.Mesh

    outer_collider_2_1: THREE.Mesh
    outer_collider_2_2: THREE.Mesh
    outer_collider_2_3: THREE.Mesh
    outer_collider_2_4: THREE.Mesh
    outer_collider_2_5: THREE.Mesh
    outer_collider_2_6: THREE.Mesh
    outer_collider_2_7: THREE.Mesh
    outer_collider_2_8: THREE.Mesh
    outer_collider_2_9: THREE.Mesh
    outer_collider_2_10: THREE.Mesh
    outer_collider_2_11: THREE.Mesh
    outer_collider_2_12: THREE.Mesh
    outer_collider_2_13: THREE.Mesh
    outer_collider_2_14: THREE.Mesh
    outer_collider_2_15: THREE.Mesh
    outer_collider_2_16: THREE.Mesh

    collider_rail_1: THREE.Mesh
    collider_rail_2: THREE.Mesh
    collider_rail_3: THREE.Mesh
    collider_rail_4: THREE.Mesh
    collider_rail_5: THREE.Mesh
    collider_rail_6: THREE.Mesh
    collider_rail_7: THREE.Mesh
    collider_rail_8: THREE.Mesh
    collider_rail_9: THREE.Mesh
    collider_rail_10: THREE.Mesh
    collider_rail_11: THREE.Mesh
    collider_rail_12: THREE.Mesh
    collider_rail_13: THREE.Mesh
    collider_rail_14: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

const colliders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const
const rails = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const

</script>

{#if $gltf}
  {#each colliders as index (index)}
    <AutoColliders>
      <T.Mesh
        name="outer_collider_3_{index}"
        geometry={$gltf.nodes[`outer_collider_3_${index}`].geometry}
        visible={false}
      />
    </AutoColliders>
  {/each}

  {#each colliders as index (index)}
    <AutoColliders>
      <T.Mesh
        name="outer_collider_2_{index}"
        geometry={$gltf.nodes[`outer_collider_2_${index}`].geometry}
        visible={false}
      />
    </AutoColliders>
  {/each}

  {#each rails as index (index)}
    <AutoColliders>
      <T.Mesh
        name="collider_rail_{index}"
        geometry={$gltf.nodes[`collider_rail_${index}`].geometry}
        visible={false}
      />
    </AutoColliders>
  {/each}
{/if}

<script lang="ts">
  import * as THREE from "three";
  import RAPIER from "@dimforge/rapier3d-compat";
  import { onMount } from "svelte";
  import { AutoColliders } from "@threlte/rapier";
  import { T } from "@threlte/core";
  import { useGltf } from "@threlte/extras";
  import { useRapier } from "@threlte/rapier";

  interface GLTFResult {
    nodes: {
      collider_rail_1: THREE.Mesh;
      collider_rail_2: THREE.Mesh;
      collider_rail_3: THREE.Mesh;
      collider_rail_4: THREE.Mesh;
      collider_rail_5: THREE.Mesh;
      collider_rail_6: THREE.Mesh;
      collider_rail_7: THREE.Mesh;
      collider_rail_8: THREE.Mesh;
      collider_rail_9: THREE.Mesh;
      collider_rail_10: THREE.Mesh;
      collider_rail_11: THREE.Mesh;
      collider_rail_12: THREE.Mesh;
      collider_rail_13: THREE.Mesh;
      collider_rail_14: THREE.Mesh;
    };
    materials: {};
  }

  const gltf = useGltf<GLTFResult>("./glb/ship.glb");

  const colliders = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ] as const;
  const rails = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;

  const { world } = useRapier();

  const vec3 = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const worldObj = new THREE.Object3D();
  const localObj = new THREE.Object3D();

  worldObj.add(localObj);
  localObj.position.set(0, 4, 6.5);

  const cuboid = RAPIER.ColliderDesc.cuboid(2.5, 2.5, 0.1);

  for (let _ of colliders) {
    const handle = world.createCollider(cuboid);
    handle.setTranslation(localObj.getWorldPosition(vec3));
    handle.setRotation(localObj.getWorldQuaternion(quat));

    worldObj.rotation.y += 0.4;
  }

  worldObj.rotation.y = 0;
  localObj.position.set(0, 2, 8);

  for (let _ of colliders) {
    const handle = world.createCollider(cuboid);
    handle.setTranslation(localObj.getWorldPosition(vec3));
    handle.setRotation(localObj.getWorldQuaternion(quat));

    worldObj.rotation.y += 0.4;
  }
</script>

{#if $gltf}
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

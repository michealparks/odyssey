<script lang="ts">
  import * as THREE from "three";
  import { T } from "@threlte/core";
  import { usePrismaticJoint, RigidBody, Collider } from "@threlte/rapier";
  import { createEventDispatcher } from "svelte";
  import { useGltf } from "@threlte/extras";
  import { addToBloom } from "../../lib/bloom";

  export let rotation = 0;
  export let switchState: 0 | 1 | 2;

  interface GLTFResult {
    nodes: {
      sphere: THREE.Mesh;
      sphere_band: THREE.Mesh;
    };
    materials: {
      Material: THREE.MeshStandardMaterial;
    };
  }

  const gltf = useGltf<GLTFResult>("./glb/ship.glb");

  const dispatch = createEventDispatcher();

  const { joint, rigidBodyA, rigidBodyB } = usePrismaticJoint(
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [0, -4]
  );

  let entered = false;

  const material = new THREE.MeshStandardMaterial({
    color: 0xff5722,
    emissive: 10,
  });

  const handleEnter = (event: any) => {
    if (event.targetRigidBody === $rigidBodyA) {
      entered = true;
      dispatch("enter");
      if (switchState === 1) material.color.set(0x4caf50);
    }
  };

  const handleExit = (event: any) => {
    if (event.targetRigidBody === $rigidBodyA) {
      entered = false;
      dispatch("exit");
      if (switchState === 0) material.color.set(0xffee58);
    }
  };
</script>

{#if $gltf}
  <T.Group position.y={0.6} rotation.y={rotation}>
    <RigidBody type="fixed" bind:rigidBody={$rigidBodyB}>
      <Collider shape="cuboid" args={[0, 0, 0]} />
    </RigidBody>
  </T.Group>

  <T.Group position.y={1.5} rotation.y={rotation}>
    <RigidBody
      type="dynamic"
      enabledRotations={[false, false, false]}
      enabledTranslations={[true, false, true]}
      bind:rigidBody={$rigidBodyA}
    >
      <Collider mass={0.1} shape="cuboid" args={[0.5, 0.5, 0.5]} />

      <T.Mesh
        name="sphere"
        castShadow
        receiveShadow
        geometry={$gltf.nodes.sphere.geometry}
        material={$gltf.nodes.sphere.material}
        position.y={-0.5}
      />
      <T.Mesh
        name="sphere_band"
        castShadow
        receiveShadow
        geometry={$gltf.nodes.sphere_band.geometry}
        position.y={-0.5}
        {material}
        on:create={({ ref }) => addToBloom(ref)}
      />
    </RigidBody>

    <Collider
      shape="ball"
      args={[0.2]}
      sensor
      on:sensorenter={handleEnter}
      on:sensorexit={handleExit}
    />
  </T.Group>
{/if}

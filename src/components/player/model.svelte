<script lang="ts">
  import * as THREE from "three";
  import { Group } from "three";
  import type { ActionName } from "./types";
  import { T } from "@threlte/core";
  import { useGltf, useGltfAnimations } from "@threlte/extras";
  import { playSound } from "../../lib/sound";
  import { fadeToAction } from "trzy";
  import type { Snippet } from "svelte";

  type GLTFResult = {
    nodes: {
      Cylinder002: THREE.SkinnedMesh;
      Cylinder002_1: THREE.SkinnedMesh;
      Cylinder002_2: THREE.SkinnedMesh;
      Cylinder002_3: THREE.SkinnedMesh;
      Cylinder002_4: THREE.SkinnedMesh;
      Cylinder002_5: THREE.SkinnedMesh;
      Bone: THREE.Bone;
    };
    materials: {
      Skin: THREE.MeshStandardMaterial;
      Eyes: THREE.MeshStandardMaterial;
      Hair: THREE.MeshStandardMaterial;
      Shirt: THREE.MeshStandardMaterial;
      Pants: THREE.MeshStandardMaterial;
      Socks: THREE.MeshStandardMaterial;
    };
  };

  type Props = {
    visible: boolean;
    action: ActionName;
    children: Snippet;
  };

  let { action = "Man_Idle", children, ...rest }: Props = $props();

  const ref = new Group();

  const gltf = useGltf<GLTFResult>("./glb/male.glb");

  let soundId1 = 0;
  let soundId2 = 0;

  const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref);

  const playAnimationSound = () => {
    const offset = 200;

    if (action === "Man_Walk") {
      const duration = 1_041;
      soundId1 = setTimeout(playSound, offset, "step2.ogg", 0.15);
      soundId2 = setTimeout(
        playSound,
        offset + duration / 2,
        "step2.ogg",
        0.15
      );
    } else if (action === "Man_Run") {
      const duration = 875;
      soundId1 = setTimeout(playSound, offset, "step1.ogg", 0.15);
      soundId2 = setTimeout(
        playSound,
        offset + duration / 2,
        "step1.ogg",
        0.15
      );
    }
  };

  mixer.addEventListener("loop", playAnimationSound);

  let previous = $actions[action];

  $effect(() => {
    if ($actions[action]) {
      fadeToAction(
        previous ?? $actions[action]!,
        $actions[action]!,
        0.1,
        action !== "Man_Death"
      );
      playAnimationSound();
      previous = $actions[action]!;
    }
  });

  ref.scale.setScalar(0.4);
</script>

{#if $gltf}
  <T is={ref} {...rest} name="Player">
    <T is={$gltf.nodes.Bone} />
    <T.SkinnedMesh
      name="Skin"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002.geometry}
      material={$gltf.materials.Skin}
      skeleton={$gltf.nodes.Cylinder002.skeleton}
      scale={0.4}
    />
    <T.SkinnedMesh
      name="Feet"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_1.geometry}
      material={$gltf.materials.Eyes}
      skeleton={$gltf.nodes.Cylinder002_1.skeleton}
      scale={0.4}
    />
    <T.SkinnedMesh
      name="Hair"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_2.geometry}
      material={$gltf.materials.Hair}
      skeleton={$gltf.nodes.Cylinder002_2.skeleton}
      scale={0.4}
    />
    <T.SkinnedMesh
      name="Shirt"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_3.geometry}
      material={$gltf.materials.Shirt}
      skeleton={$gltf.nodes.Cylinder002_3.skeleton}
      scale={0.4}
    />
    <T.SkinnedMesh
      name="Pants"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_4.geometry}
      material={$gltf.materials.Pants}
      skeleton={$gltf.nodes.Cylinder002_4.skeleton}
      scale={0.4}
    />
    <T.SkinnedMesh
      name="Socks"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_5.geometry}
      material={$gltf.materials.Socks}
      skeleton={$gltf.nodes.Cylinder002_5.skeleton}
      scale={0.4}
    />
    {@render children?.()}
  </T>
{/if}

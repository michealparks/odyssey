<script lang="ts">
  import type { Snippet } from 'svelte'
  import {
    type SkinnedMesh,
    type Bone,
    type MeshStandardMaterial,
    AnimationAction,
  } from 'three'
  import { Group } from 'three'
  import type { ActionName } from './types'
  import { T } from '@threlte/core'
  import { useGltf, useGltfAnimations } from '@threlte/extras'
  import { playSound } from '../../lib/sound'
  import { fadeToAction } from '../../lib/animation'

  type GLTFResult = {
    nodes: {
      Cylinder002: SkinnedMesh
      Cylinder002_1: SkinnedMesh
      Cylinder002_2: SkinnedMesh
      Cylinder002_3: SkinnedMesh
      Cylinder002_4: SkinnedMesh
      Cylinder002_5: SkinnedMesh
      Bone: Bone
    }
    materials: {
      Skin: MeshStandardMaterial
      Eyes: MeshStandardMaterial
      Hair: MeshStandardMaterial
      Shirt: MeshStandardMaterial
      Pants: MeshStandardMaterial
      Socks: MeshStandardMaterial
    }
  }

  interface Props {
    action?: ActionName
    children?: Snippet
    [key: string]: any
  }

  let { action = 'Man_Idle', children, ...rest }: Props = $props()

  const ref = new Group()

  const gltf = useGltf<GLTFResult>(`${import.meta.env.BASE_URL}glb/male.glb`)

  let soundId1 = 0
  let soundId2 = 0

  const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref)

  const playAnimationSound = () => {
    const offset = 200

    if (action === 'Man_Walk') {
      const duration = 1_041
      clearTimeout(soundId1)
      clearTimeout(soundId2)
      soundId1 = setTimeout(playSound, offset, 'step2.ogg', 0.15)
      soundId2 = setTimeout(playSound, offset + duration / 2, 'step2.ogg', 0.15)
    } else if (action === 'Man_Run') {
      const duration = 875
      clearTimeout(soundId1)
      clearTimeout(soundId2)
      soundId1 = setTimeout(playSound, offset, 'step1.ogg', 0.15)
      soundId2 = setTimeout(playSound, offset + duration / 2, 'step1.ogg', 0.15)
    }
  }

  mixer.addEventListener('loop', playAnimationSound)

  let previous: AnimationAction | undefined

  $effect(() => {
    if ($actions[action]) {
      fadeToAction(previous, $actions[action]!, 0.1, action !== 'Man_Death')
      playAnimationSound()
      previous = $actions[action]
    }
  })
</script>

<T
  is={ref}
  dispose={false}
  name="Player"
  scale={0.4}
  {...rest}
>
  {#if $gltf}
    <T is={$gltf.nodes.Bone} />
    <T.SkinnedMesh
      name="Skin"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002.geometry}
      material={$gltf.materials.Skin}
      skeleton={$gltf.nodes.Cylinder002.skeleton}
    />
    <T.SkinnedMesh
      name="Feet"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_1.geometry}
      material={$gltf.materials.Eyes}
      skeleton={$gltf.nodes.Cylinder002_1.skeleton}
    />
    <T.SkinnedMesh
      name="Hair"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_2.geometry}
      material={$gltf.materials.Hair}
      skeleton={$gltf.nodes.Cylinder002_2.skeleton}
    />
    <T.SkinnedMesh
      name="Shirt"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_3.geometry}
      material={$gltf.materials.Shirt}
      skeleton={$gltf.nodes.Cylinder002_3.skeleton}
    />
    <T.SkinnedMesh
      name="Pants"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_4.geometry}
      material={$gltf.materials.Pants}
      skeleton={$gltf.nodes.Cylinder002_4.skeleton}
    />
    <T.SkinnedMesh
      name="Socks"
      castShadow
      receiveShadow
      geometry={$gltf.nodes.Cylinder002_5.geometry}
      material={$gltf.materials.Socks}
      skeleton={$gltf.nodes.Cylinder002_5.skeleton}
    />
    {@render children?.()}
  {/if}
</T>

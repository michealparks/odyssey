<script lang="ts">
  import * as THREE from 'three'
  import { useGltf, HTML } from '@threlte/extras'
  import { AutoColliders } from '@threlte/rapier'
  import { T } from '@threlte/core'
  import { frame, setFrame, cameraAnimating, gameState } from '../../stores/state'
  import InteractionSensor from '../interaction-sensor.svelte'
  import ConsoleScreen from './console-screen.svelte'
  import Dialogue from './dialogue.svelte'
  import { setStatic } from '../../lib/static'

  interface GLTFResult {
    nodes: {
      console: THREE.Mesh
      console_screen: THREE.Mesh
    }
    materials: {}
  }

  const gltf = useGltf<GLTFResult>(`${import.meta.env.BASE_URL}glb/ship.glb`)

  let visible = $derived($frame.includes('level_3'))
</script>

<InteractionSensor
  shape="cuboid"
  position={[4.77, 4.63, -0.09]}
  args={[1, 1, 1]}
  options={['e']}
  labels={['interact']}
  visible={$frame !== 'level_3_console'}
  onInteract={() => setFrame('level_3_console')}
  onExit={() => setFrame('level_3')}
/>

<ConsoleScreen {visible}>
  {#if $frame === 'level_3_console' && !$cameraAnimating}
    <HTML
      center
      sprite
    >
      <section
        class={[
          'absolute top-0 right-0 border border-white translate-x-1/2 -translate-y-full -mt-20 px-4 py-8 backdrop-blur-xs',
          $gameState === 'fixedComputer' ? 'w-[30vw]' : 'w-fit',
        ]}
      >
        {#if $gameState === 'fixedComputer'}
          <Dialogue />
        {:else}
          <p class="font-mono text-white">asgr;oijznsvlsdlfnkfehlks...?</p>
        {/if}

        <div class="absolute h-20 w-px -bottom-20 left-1/2 bg-white"></div>
      </section>
    </HTML>
  {/if}
</ConsoleScreen>

{#if $gltf}
  <AutoColliders shape="cuboid">
    <T
      is={$gltf.nodes.console}
      castShadow
      receiveShadow
      {visible}
      oncreate={(ref) => {
        setStatic(ref)
      }}
    />
  </AutoColliders>
{/if}

<script lang='ts'>

import { useGltf, HTML } from '@threlte/extras'
import { AutoColliders } from '@threlte/rapier'
import { T } from '@threlte/core'
import { frame, setFrame, cameraAnimating, gameState } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte'
import ConsoleScreen from './console-screen.svelte'
import Dialogue from './dialogue.svelte'

interface GLTFResult {
  nodes: {
    console: THREE.Mesh
    console_screen: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

$: visible = $frame.includes('level_3')

const handleSelectConsole = () => {
  setFrame('level_3_console')
}

</script>

{#if $gltf}
  <InteractionSensor
    shape='cuboid'
    position={[4.77, 4.63, -0.09]}
    args={[1, 1, 1]}
    options={['e']}
    labels={['interact']}
    visible={$frame !== 'level_3_console'}
    on:interact={handleSelectConsole}
    on:exit={() => setFrame('level_3')}
  />

  <ConsoleScreen {visible}>
    {#if $frame === 'level_3_console' && !$cameraAnimating}
      <HTML center sprite>
        <section class={$gameState === 'fixedComputer' ? 'w-[30vw]' : 'w-[fit-content]'}>
          {#if $gameState === 'fixedComputer'}
            <Dialogue />
          {:else}
            <p>asgr;oijznsvlsdlfnkfehlks...?</p>
          {/if}
          <div />
        </section>
        
      </HTML>
    {/if}
  </ConsoleScreen>

  <AutoColliders shape='cuboid'>
    <T
      is={$gltf.nodes.console}
      castShadow
      receiveShadow
      {visible}
    >
      
    </T>
  </AutoColliders>
{/if}

<style>
  section {
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid white;
    transform: translate(50%, -100%);
    margin-top: -5rem;
    padding: 1rem 2rem;
    backdrop-filter: blur(1px);
  }

  p {
    font-family: monospace;
    color: white;
  }

  div {
    position: absolute;
    height: 5rem;
    width: 1px;
    bottom: -5rem;
    left: 50%;
    background-color: white;
  }
</style>
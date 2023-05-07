<script lang='ts'>

import * as THREE from 'three'
import { useGltf, HTML } from '@threlte/extras'
import { Collider } from '@threlte/rapier'
import { T } from '@threlte/core'
import { frame, gameState } from '../../stores/state'
import InteractionSensor from '../interaction-sensor.svelte';
import { setStatic } from '../../lib/static'

interface GLTFResult {
  nodes: {
    stasis_chamber: THREE.Mesh
  }
  materials: {}
}

const gltf = useGltf<GLTFResult>('./glb/ship.glb')

let exited = false
let erroring = false

const handleInteract = () => {
  if ($gameState === 'restoredSystems') {
    $gameState = 'end'
    $frame = 'end'
  } else {
    erroring = true
    setTimeout(() => (erroring = false), 2000)
  }
}

$: visible = $frame.includes('level_3')

$: {
  if ($gameState === 'awoken') {
    // start()
    $gameState = 'seeking'
  }
}

</script>

{#if $gltf}
  <T
    is={$gltf.nodes.stasis_chamber}
    castShadow
    receiveShadow
    {visible}
    on:create={(event) => setStatic(event.ref)}
  >
    <Collider
      shape='roundCylinder'
      args={[1.3, 0.9, 0]}
    />

    {#if erroring}
    <HTML center>
      <div class='bg-red-500 text-white uppercase p-1 w-28 text-center font-mono font-bold border border-white text-xs z-50'>
        no response
      </div>
    </HTML>
    {:else}
      <T.Group
        position.z={0.5}
        on:create={(event) => setStatic(event.ref)}
      >
        <InteractionSensor
          visible={exited}
          shape='roundCylinder'
          args={[1.3, 0.9, 0]}
          options={['e']}
          labels={['sleep']}
          on:interact={handleInteract}
          on:exit={() => (exited = true)}
        />
      </T.Group>
    {/if}
  </T>
{/if}

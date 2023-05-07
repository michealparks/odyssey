import * as THREE from 'three'
import { useThrelte } from '@threlte/core'
import { softShadows } from 'trzy'

export const configure = () => {
  const { renderer, scene } = useThrelte()

  renderer!.debug.checkShaderErrors = import.meta.env.DEV

  softShadows()

  scene.fog = new THREE.Fog( 0x000000, 1, 100 );
}

import * as THREE from 'three'

let previousAction: THREE.AnimationAction | undefined
let activeAction: THREE.AnimationAction

export const fadeToAction = (newAction: THREE.AnimationAction, duration: number ) => {

  previousAction = activeAction
  activeAction = newAction;

  if (previousAction !== activeAction) {
    previousAction?.fadeOut( duration )
  }

  activeAction
    .reset()
    .setEffectiveTimeScale( 1 )
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play()
}

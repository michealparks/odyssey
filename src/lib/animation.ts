import * as THREE from 'three'

let previousAction: THREE.AnimationAction | undefined
let activeAction: THREE.AnimationAction

export const fadeToAction = (newAction: THREE.AnimationAction, duration: number, loop = true) => {

  previousAction = activeAction
  activeAction = newAction;

  if (previousAction !== activeAction) {
    previousAction?.fadeOut( duration )
  }

  if (loop) {
    activeAction.loop = THREE.LoopRepeat
    activeAction.clampWhenFinished = false
  } else {
    activeAction.loop = THREE.LoopOnce
    activeAction.clampWhenFinished = true
  }

  activeAction
    .reset()
    .setEffectiveTimeScale( 1 )
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play()
}

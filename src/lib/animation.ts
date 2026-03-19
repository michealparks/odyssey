import { type AnimationAction, LoopRepeat, LoopOnce } from 'three'

export const fadeToAction = (previous: AnimationAction | undefined, action: AnimationAction, duration: number, loop = true) => {
  if (previous !== action) {
    previous?.fadeOut( duration )
  }

  if (loop) {
    action.loop = LoopRepeat
    action.clampWhenFinished = false
  } else {
    action.loop = LoopOnce
    action.clampWhenFinished = true
  }

  action
    .reset()
    .setEffectiveTimeScale( 1 )
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play()
}

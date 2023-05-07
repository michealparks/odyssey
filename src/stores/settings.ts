import { writable } from 'svelte/store'
import { save, storage } from '../lib/storage'

export type GraphicsMode = 'performance' | 'balanced' | 'quality'

export const graphics = writable<GraphicsMode>(storage('graphics') as GraphicsMode)
export const dpr = writable(window.devicePixelRatio)

graphics.subscribe(value => {
  if (value === 'performance') {
    dpr.set(Math.min(0.75, window.devicePixelRatio))
  } else if (value === 'balanced') {
    dpr.set(Math.min(1.5, window.devicePixelRatio))
  } else {
    dpr.set(window.devicePixelRatio)
  }
  

  save('graphics', value)
})

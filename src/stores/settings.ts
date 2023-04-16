import { writable } from 'svelte/store'
import { save, storage } from '../lib/storage'

export type GraphicsMode = 'performance' | 'balanced' | 'quality'

export const graphics = writable<GraphicsMode>(storage('graphics') as GraphicsMode)

graphics.subscribe(value => save('graphics', value))

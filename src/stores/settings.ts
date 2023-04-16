import { writable } from 'svelte/store'
import { storage } from '../lib/storage'

export type GraphicsMode = 'performance' | 'quality'

export const graphics = writable<GraphicsMode>(storage('graphics') as GraphicsMode)

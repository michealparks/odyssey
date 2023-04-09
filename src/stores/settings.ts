import { writable } from 'svelte/store'

export type GraphicsMode = 'performance' | 'quality'

export const graphics = writable<GraphicsMode>(localStorage.getItem('graphics') as GraphicsMode ?? 'quality');

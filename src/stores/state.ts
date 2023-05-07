import { writable } from 'svelte/store'
import * as Easing from 'svelte/easing'
import { tweened } from 'svelte/motion'
import { storage } from '../lib/storage'

type Levels = 1 | 2 | 3 | 4

type Frames =
  | 'title'
  | 'level_3' | 'level_3_console'
  | 'level_2'
  | 'level_1'
  | 'end'

let frameValue: Frames = storage('frame') as Frames
let levelValue: Levels = Number.parseInt(storage('level')!) as Levels

export let allowPlayerControl = true

export const animationPlayerControl = writable(false)

export const frame = writable<Frames>(frameValue)
export const level = writable<Levels>(levelValue)

export const setFrame = (value: Frames) => frame.set(value)
export const setLevel = (value: Levels) => level.set(value)

const translations = {
  level_3: [
    [0, 18, 24],
    [-0.6, 0, 0]
  ],
  level_3_console: [
    [-1.3, 14.3, 11.3],
    [-0.75, -0.53, -0.44]
  ],
  level_2: [
    [0, 15, 16],
    [-0.8, 0, 0]
  ],
  level_1: [
    [0, 11, 11],
    [-1, 0, 0]
  ],
  title: [
    [0, 0, 57],
    [0, 0, 0],
  ],
  end: [
    [0, 0, 57],
    [0, 0, 0],
  ],
} as const

const easing = Easing.cubicInOut
const duration = 1500

const [position, rotation] = translations[frameValue]

export const cameraPosition = tweened(position, { easing, duration })
export const cameraRotation = tweened(rotation, { easing, duration })
export const cameraAnimating = writable<boolean>(false)

frame.subscribe(async (update) => {
  const [position, rotation] = translations[update]

  if (update === 'end') level.set(4)
  if (update.includes('level_3')) level.set(3)
  if (update.includes('level_2')) level.set(2)
  if (update.includes('level_1')) level.set(1)

  cameraAnimating.set(true)

  cameraRotation.set(rotation)
  await cameraPosition.set(position)

  cameraAnimating.set(false)

  console.log(update)
})

export const elevatorPosition = tweened(3.83, { easing, duration })

level.subscribe(async (update) => {
  allowPlayerControl = false
  animationPlayerControl.set(true)

  if      (update === 3) await elevatorPosition.set(3.83)
  else if (update === 2) await elevatorPosition.set(-0.48)

  allowPlayerControl = true
  animationPlayerControl.set(false)
})

type GameStates = 'intro' | 'awoken' | 'seeking' | 'defeatedSentry' | 'fixedComputer' | 'restoredSystems' | 'end' | 'lose'

export const gameState = writable<GameStates>(storage('gameState') as GameStates)

export const explosionPosition = writable<[x: number, z: number] | null>(null)

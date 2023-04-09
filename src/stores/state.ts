import { writable } from 'svelte/store'
import * as Easing from 'svelte/easing'
import { tweened } from 'svelte/motion'

type Levels = 1 | 2 | 3 | 4

type Frames =
  | 'title'
  | 'level_3' | 'level_3_console'
  | 'level_2'
  | 'level_1'

let frameValue: Frames = (localStorage.getItem('frame') ?? 'title') as Frames
let levelValue: Levels = localStorage.getItem('level') ? Number.parseInt(localStorage.getItem('level')) as Levels : 4

export let allowUserControl = true

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
    [0, 0, 0]
  ],
} as const

const easing = Easing.cubicInOut
const duration = 1500

const [position, rotation] = translations[frameValue]

export const cameraPosition = tweened(position, { easing, duration })
export const cameraRotation = tweened(rotation, { easing, duration })

frame.subscribe((update) => {
  const [position, rotation] = translations[update]
  cameraPosition.set(position)
  cameraRotation.set(rotation)

  if (update.includes('level_3')) return level.set(3)
  if (update.includes('level_2')) return level.set(2)
  if (update.includes('level_1')) return level.set(1)
})

export const elevatorPosition = tweened(3.83, { easing, duration })

level.subscribe(async (update) => {
  allowUserControl = false

  if      (update === 3) await elevatorPosition.set(3.83)
  else if (update === 2) await elevatorPosition.set(-0.48)

  allowUserControl = true
})

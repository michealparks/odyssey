const defaults: Record<string, string> = {
  graphics: 'quality',
  frame: 'title',
  level: '4',
  gameState: 'intro',
} as const

export const storage = (key: string): string | null => {
  return localStorage.getItem(key) ?? defaults[key] ?? null
}

export const save = (key: string, value: string): void => {
  return localStorage.setItem(key, value)
}

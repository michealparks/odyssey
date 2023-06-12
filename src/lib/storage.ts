const defaults: Record<string, string> = {
  graphics: 'quality',
  frame: 'title',
  level: '4',
  gameState: 'intro',
} as const

const iosDefaults: Record<string, string> = {
  graphics: 'performance'
}

const iOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

export const storage = (key: string): string | null => {
  return localStorage.getItem(key) ?? (iOS() ? iosDefaults[key] : defaults[key]) ?? null
}

export const save = (key: string, value: string): void => {
  return localStorage.setItem(key, value)
}

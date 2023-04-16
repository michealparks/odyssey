const sounds: Record<string, HTMLAudioElement> = {}

export const playSound = (name: string) => {
  if (sounds[name]) {
    const audio = sounds[name]!
    audio.play()
    return audio
  }

  const audio = document.createElement('audio')
  audio.src = `mp3/${name}`
  audio.currentTime = 0
  audio.play()
  audio.volume = 0.5
  sounds[name] = audio

  return audio
}
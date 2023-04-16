const audios: Record<string, HTMLAudioElement> = {}

export const playSound = (file: string) => {
  let audio = audios[file]

  if (audio === undefined) {
    audio = document.createElement('audio')
    audio.src = `mp3/${file}`
    audio.volume = 0.5
    audios[file] = audio
  }

  audio.currentTime = 0
  audio.play()
  return audio
}

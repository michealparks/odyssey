const audios: Record<string, HTMLAudioElement> = {}

export const playSound = (file: string, volume = 0.5) => {
  let audio = audios[file]

  if (audio === undefined) {
    audio = document.createElement('audio')
    audio.src = `${import.meta.env.BASE_URL}mp3/${file}`
    
    audios[file] = audio
  }

  audio.volume = volume
  audio.currentTime = 0
  audio.play()
  return audio
}

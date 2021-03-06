import { Howler, Howl } from 'howler'

import { SOUNDS } from '@/constants/SOURCES'
import Blocks from '../World/Blocks'

class AudioManager {
  activeHowl: Howl | null
  randomSounds: string[]
  sounds: {
    name: string
    howl: Howl
    volume: number
  }[]
  constructor() {}

  async setup() {
    const promises = []
    this.randomSounds = ['ordalie_bbq_walk_braises', 'ordalie_bbq_jump', 'garde_walk', 'cuisinier_walk']
    // this.activeHowl = null
    Howler.volume(1)
    for (const sound of SOUNDS) {
      promises.push(this.loadSound(sound))
    }

    this.sounds = await Promise.all(promises)
    useStore().soundsLoaded.value = true
  }

  async loadSound(sound: { name: string; path: string; volume?: number }) {
    return new Promise((resolve, reject) => {
      const s = new Howl({
        src: sound.path,
        volume: sound.volume ? sound.volume : 1,
        preload: true,
        html5: true,
      })

      const obj = {
        name: sound.name,
        howl: s,
        volume: sound.volume,
      }

      s.on('load', resolve(obj))
    })
  }

  play(name: string, loop?: boolean) {
    if (this.randomSounds.includes(name)) {
      this.playRandom(name)
      return
    }

    const sound = this.sounds.find((sound) => sound.name === name)
    // console.log('called in update')

    if (sound.name !== 'gameover' && sound.name !== 'success') sound.howl.rate(Blocks.getCurrent().getSpeedCoef())

    sound.howl.play()

    if (loop) sound.howl.loop(true)
  }

  playRandom(name: string) {
    const sounds = this.sounds.filter((sound) => sound.name.startsWith(name))
    const sound = sounds[Math.floor(Math.random() * sounds.length)]

    sound.howl.play()
  }

  fadeIn(name: string, durationInMs: number) {
    const sound = this.sounds.find((sound) => sound.name === name)
    sound.howl.play()
    sound.howl.fade(0, 1, durationInMs)
  }

  fadeOut(name: string, durationInMs: number) {
    const sound = this.sounds.find((sound) => sound.name === name)
    const volume = sound.howl.volume()

    sound.howl.fade(volume, 0, durationInMs)

    sound.howl.once('fade', () => {
      sound.howl.stop()
      sound.howl.volume(sound.volume ? sound.volume : 1)
    })
  }

  isPlaying(name: string) {
    const sound = this.sounds.find((sound) => sound.name === name)
    return sound.howl.playing()
  }
}

export default new AudioManager()

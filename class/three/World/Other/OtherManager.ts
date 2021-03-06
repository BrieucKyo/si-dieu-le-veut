import OTHERS from '@/constants/OTHERS'

import OtherSplashscreen from '@/class/three/World/Other/OtherSplashscreen'
import Blocks from '@/class/three/World/Blocks'
import Other from '@/class/three/World/Other/Other'

class OtherManager {
  private instances: Other[] = []
  private currentIndex = -1
  private lastType: OTHERS

  /**
   * Create other from type
   */
  create(_type: OTHERS) {
    const other = new Other(_type)
    this.instances.push(other)
    this.lastType = _type
  }

  /**
   * Create next other
   */
  createNext() {
    switch (this.lastType) {
      case OTHERS.SPLASHSCREEN:
        break
      case OTHERS.CINEMATIC_1:
        this.create(OTHERS.CINEMATIC_2)
        break
      case OTHERS.CINEMATIC_2:
        this.create(OTHERS.CINEMATIC_3)
        break
      case OTHERS.CINEMATIC_3:
        this.create(OTHERS.TUTORIAL)
        break
      case OTHERS.TUTORIAL:
        this.create(OTHERS.DEAD)
        break
      case OTHERS.DEAD:
        this.create(OTHERS.END)
        break
    }
  }

  getSplashscreen() {
    return this.getByIndex(0)
  }

  /**
   * Get all others instances
   */
  getAll() {
    return this.instances
  }

  /**
   * Get other by index
   */
  getByIndex(index: number) {
    return this.instances[index]
  }

  /**
   * Get current other from current index
   */
  getCurrent() {
    return this.instances[this.currentIndex]
  }

  /**
   * Get next other
   */
  getNext() {
    return this.instances[this.currentIndex + 1]
  }

  /**
   * Set current new current index
   */
  setCurrentIndex(index: number) {
    this.currentIndex = index
  }

  /**
   * Start next other
   */
  startNext() {
    // console.log('✨ START NEXT')
    this.currentIndex++
    this.getCurrent().start()
  }

  /**
   * On Other started
   */
  onStarted() {
    console.log('✨ STARTED ' + this.getCurrent().block.getType())
    useStore().currentType.value = this.getCurrent().block.getType()
    Blocks.onStarted()
  }

  /**
   * On Other ended
   */
  onEnded() {
    console.log('✨ ENDED ' + this.getCurrent().block.getType())
    // Dont unmount if Other is End
    if (this.getCurrent().block.getType() !== OTHERS.END && this.getCurrent().block.getType() !== OTHERS.DEAD) {
      useStore().currentType.value = null
    }
    Blocks.onEnded()
  }
}

export default new OtherManager()

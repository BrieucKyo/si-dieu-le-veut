import gsap from 'gsap'

import ORDALIES from '@/constants/ORDALIES'

import AudioManager from '@/class/three/utils/AudioManager'

import Block from '@/class/three/World/Block'
import OrdalieManager from '@/class/three/World/Ordalie/OrdalieManager'
import OrdalieCroix from '@/class/three/World/Ordalie/OrdalieCroix'
import OrdalieBBQ from '@/class/three/World/Ordalie/OrdalieBBQ'
import OrdalieFood from '@/class/three/World/Ordalie/OrdalieFood'

class Ordalie {
  block: Block
  instance: OrdalieCroix | OrdalieBBQ | OrdalieFood
  updateId: () => void

  constructor(_type: ORDALIES) {
    this.block = new Block(_type)
    this.block.toggleCharacter(false)

    switch (_type) {
      case ORDALIES.CROIX:
        this.instance = new OrdalieCroix(this)
        break
      case ORDALIES.BBQ:
        this.instance = new OrdalieBBQ(this)
        break
      case ORDALIES.FOOD:
        this.instance = new OrdalieFood(this)
        break
    }
    this.updateId = this.update
  }

  start() {
    this.instance.start()
    OrdalieManager.onStarted()
    gsap.ticker.add(this.updateId)

    this.block.moveBehind()
    this.block.toggleCharacter(true)
    this.block.toggleFrustumCulling(false)

    AudioManager.play('ordalie_music', true)
  }

  end() {
    AudioManager.fadeOut('ordalie_music', 100)
    AudioManager.play('ordalie_end')

    this.block.moveDefault()

    gsap.ticker.remove(this.updateId)
    OrdalieManager.onEnded()

    if (OrdalieManager.isPlayerDead) return
    this.block.toggleCharacter(false)
    this.block.toggleFrustumCulling(true)
    this.block.dipose()
  }

  update = () => {
    this.instance && this.instance.update()
    console.log(`🔁 ${this.block.getType()}`)
  }
}

export default Ordalie

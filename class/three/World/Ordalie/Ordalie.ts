import ORDALIES from '@/constants/ORDALIES'
import Block from '@/class/three/World/Block'
import OrdalieCroix from '@/class/three/World/Ordalie/OrdalieCroix'
import gsap from 'gsap'

class Ordalie {
  block: Block
  ordalie: OrdalieCroix
  updateId: () => void

  constructor(_type: ORDALIES) {
    this.block = new Block(_type)

    switch (_type) {
      case ORDALIES.CROIX:
        this.ordalie = new OrdalieCroix({ model: this.block.model })

        break

      default:
        break
    }

    this.updateId = this.update
    this.start()
  }

  start() {
    gsap.ticker.add(this.updateId)
  }

  end() {
    gsap.ticker.remove(this.updateId)
  }

  update = () => {
    this.ordalie.update()
  }
}

export default Ordalie
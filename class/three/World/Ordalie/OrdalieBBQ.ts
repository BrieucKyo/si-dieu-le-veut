import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

import ORDALIES from '@/constants/ORDALIES'
import SOUNDS from '@/constants/SOUNDS'
import ANIMATIONS from '@/constants/ANIMATIONS'
import HEAD from '@/constants/HEAD'
import { BBQInterface } from '@/constants/DIFFICULTY_DATA'

import WebGL from '@/class/three/WebGL'
import AudioManager from '@/class/three/utils/AudioManager'

import { getFrame } from '@/class/three/utils/Maths'
import setHTMLPosition from '@/class/three/utils/setHTMLPosition'
import OrdalieManager from '@/class/three/World/Ordalie/OrdalieManager'
import Ordalie from '@/class/three/World/Ordalie/Ordalie'

import fragmentShader from '@/class/three/shaders/burning/fragment.glsl'
import vertexShader from '@/class/three/shaders/burning/vertex.glsl'

class OrdalieBBQ {
  instance: Ordalie
  character: THREE.Mesh
  characterPosEntreeEnd = new THREE.Vector3(0)
  characterPosSortieStart = new THREE.Vector3(0)
  texts: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial | THREE.ShaderMaterial>[]

  container: HTMLDivElement[]
  // Gameplay
  animation: {
    mixer: THREE.AnimationMixer
    actions: {
      [key: string]: {
        action: THREE.AnimationAction
        frames: {
          frame: number
          sound: string
        }[]
        lastFrame: number
      }
    }
    play: (name: string) => void
  }
  forwardSpeed = 0.11
  modulo = 0
  uniforms: {
    uNoise: { value: THREE.Texture }
    uGradient: { value: THREE.Texture }
    uTexture: { value: THREE.Texture }
  }
  isGameWon = false
  difficultyData: BBQInterface

  debugFolder: GUI

  constructor(_ordalie: Ordalie) {
    this.instance = _ordalie

    this.instance.block.changeCharacterHead(HEAD.SAD)
    this.difficultyData = this.instance.block.getDifficultyData() as BBQInterface
    this.texts = []

    this.container = []

    const debugParams = {
      head: HEAD.SAD,
    }

    if (WebGL.debug.isActive()) {
      this.debugFolder = WebGL.debug.addFolder('BBQ')
      this.debugFolder
        .add(debugParams, 'head', {
          ...HEAD,
        })
        .onChange((value) => {
          this.instance.block.changeCharacterHead(value)
        })
    }

    this.instance.block.getModel().scene.traverse((mesh) => {
      if (mesh.name.startsWith('banniere_ordalieFER')) {
        this.texts.push(mesh)
      }
    })

    // if (WebGL.debug.isActive()) {
    // this.debugFolder = WebGL.debug.addFolder('OrdalieBBQ')
    // this.debugFolder.add(this.braises[0], 'visible').name('braises 0')
    // this.debugFolder.add(this.braises[1], 'visible').name('braises 1')
    // this.debugFolder.add(this.braises[2], 'visible').name('braises 2')
    // this.debugFolder.add(this.braises[0].material, 'opacity', 0, 1).name('opacity 0')
    // this.debugFolder.add(this.braises[1].material, 'opacity', 0, 1).name('opacity 1')
    // this.debugFolder.add(this.braises[2].material, 'opacity', 0, 1).name('opacity 2')
    // }

    this.setAnimation()
    this.setTexts()
  }

  setContainer(container: HTMLDivElement, i: number) {
    this.container[i] = container
  }

  start() {
    window.addEventListener('resize', this.onResize)
    this.animation.play(ANIMATIONS.BBQ.ENTREE)
    AudioManager.play('ordalie_bbq_ambient', true)
  }

  end() {
    AudioManager.fadeOut('ordalie_bbq_ambient', 100)
    window.removeEventListener('resize', this.onResize)
    if (this.debugFolder) this.debugFolder.destroy()
    this.instance.end()
  }

  private onResize = () => {
    for (let i = 0; i < this.container.length; i++) {
      this.updateHTML(i)
    }
  }

  updateHTML(i: number) {
    const positions = setHTMLPosition(this.texts[i])
    this.container[i].style.transform = `translate(${positions.topLeft.x}px,${positions.topLeft.y}px)`
    this.container[i].style.width = positions.width + 'px'
    this.container[i].style.height = positions.height + 'px'
    this.container[i].style.fontSize = positions.width / 11.28 + 'px'

    //11.28 vient de 282/25 parce que le container fait 282px la bonne taille est de 25 px
  }

  private setTexts() {
    const texture = 'map' in this.texts[0].material ? this.texts[0].material.map : null
    const noise = WebGL.resources.getItems('COMMON', 'noise')
    const gradient = WebGL.resources.getItems('COMMON', 'gradient')

    this.uniforms = {
      uNoise: { value: noise },
      uGradient: { value: gradient },
      uTexture: { value: texture },
    }

    for (let i = 0; i < this.texts.length; i++) {
      this.texts[i].material = new THREE.ShaderMaterial({
        uniforms: { ...this.uniforms, uDissolve: { value: 0 } },
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        transparent: true,
      })
    }
  }

  private setAnimation() {
    const mixer = new THREE.AnimationMixer(this.instance.block.getModel().scene)

    this.animation = {
      mixer,
      actions: {
        [ANIMATIONS.BBQ.AVANCE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[0]),
          frames: SOUNDS[ORDALIES.BBQ][ANIMATIONS.BBQ.AVANCE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.BBQ.ENTREE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[1]),
          frames: SOUNDS[ORDALIES.BBQ][ANIMATIONS.BBQ.ENTREE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.BBQ.IDLE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[2]),
          frames: SOUNDS[ORDALIES.BBQ][ANIMATIONS.BBQ.IDLE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.BBQ.MORT]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[3]),
          frames: SOUNDS[ORDALIES.BBQ][ANIMATIONS.BBQ.MORT].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.BBQ.SORTIE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[4]),
          frames: SOUNDS[ORDALIES.BBQ][ANIMATIONS.BBQ.SORTIE].frames,
          lastFrame: 0,
        },
      },
      play: (name: string) => {
        this.animation.actions[name].action.play()
      },
    }

    this.animation.actions[ANIMATIONS.BBQ.AVANCE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.BBQ.AVANCE].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.BBQ.ENTREE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.BBQ.ENTREE].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.timeScale = 1.2
    // this.animation.actions[ANIMATIONS.BBQ.IDLE].clampWhenFinished = true
    // this.animation.actions[ANIMATIONS.BBQ.IDLE].loop = THREE.LoopOnce
    this.animation.actions[ANIMATIONS.BBQ.MORT].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.BBQ.MORT].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.BBQ.SORTIE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.BBQ.SORTIE].action.loop = THREE.LoopOnce

    this.animation.mixer.addEventListener('finished', (e) => this.onFinish(e))

    // Debug
    // if (WebGL.debug.isActive()) {
    //   this.debugFolder.add(this.debugParams().animations, 'playCharacterEnter')
    // }
  }

  onFinish(e) {
    if (e.action._clip.name === ANIMATIONS.BBQ.ENTREE) {
      this.characterPosEntreeEnd.set(this.instance.block.getCharacterRoot().position.x, this.instance.block.getCharacterRoot().position.y, this.instance.block.getCharacterRoot().position.z)
      this.animation.actions[ANIMATIONS.BBQ.ENTREE].action.stop()
      this.instance.block.getCharacterRoot().position.set(this.characterPosEntreeEnd.x, this.characterPosEntreeEnd.y, this.characterPosEntreeEnd.z)
      this.animation.actions[ANIMATIONS.BBQ.IDLE].action.play()
    }

    if (e.action._clip.name === ANIMATIONS.BBQ.AVANCE) {
      this.animation.actions[ANIMATIONS.BBQ.AVANCE].action.stop()
      this.animation.actions[ANIMATIONS.BBQ.IDLE].action.reset()
      this.animation.play(ANIMATIONS.BBQ.IDLE)
    }

    if (e.action._clip.name === ANIMATIONS.BBQ.MORT || e.action._clip.name === ANIMATIONS.BBQ.SORTIE) {
      this.end()
    }
  }

  makeAStep() {
    if (this.isGameWon) return

    AudioManager.play('ordalie_bbq_jump')
    setTimeout(() => {
      AudioManager.play('ordalie_bbq_walk_braises')
    }, 500)

    this.animation.actions[ANIMATIONS.BBQ.AVANCE].action.stop()
    this.animation.play(ANIMATIONS.BBQ.AVANCE)

    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.BBQ.AVANCE].action, 0.16, false)

    gsap.to(this.instance.block.getCharacterRoot().position, {
      x: this.instance.block.getCharacterRoot().position.x + this.forwardSpeed,
      duration: 1,
    })
  }

  gameWon() {
    this.isGameWon = true

    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.stop()
    this.characterPosSortieStart.set(this.instance.block.getCharacterRoot().position.x, this.instance.block.getCharacterRoot().position.y, this.instance.block.getCharacterRoot().position.z)
    this.animation.play(ANIMATIONS.BBQ.SORTIE)
    this.instance.block.getCharacterRoot().position.set(this.characterPosSortieStart.x, this.characterPosSortieStart.y, this.characterPosSortieStart.z)

    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.BBQ.SORTIE].action, 0.16, false)
  }

  gameOver() {
    if (OrdalieManager.isPlayerDead) {
      return
    }
    AudioManager.play('ordalie_bbq_death')
    OrdalieManager.setIsDead(true)
    // this.animation.actions[ANIMATIONS.BBQ.ENTREE].fadeOut(0)
    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.stop()
    this.animation.play(ANIMATIONS.BBQ.MORT)
    this.animation.actions[ANIMATIONS.BBQ.IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.BBQ.MORT].action, 0.16, false)

    for (let i = 0; i < this.texts.length; i++) {
      const material = this.texts[i].material as THREE.ShaderMaterial
      gsap.to(material.uniforms.uDissolve, {
        value: 1,
        duration: 1,
      })
    }
  }

  update() {
    const { deltaTime } = WebGL.time
    this.animation.mixer.update(deltaTime * 0.001 * this.instance.block.getSpeedCoef())

    // console.log()
    // this.animation.actions[ANIMATIONS.BBQ.MORT].action.isRunning()

    for (const animation of Object.values(this.animation.actions)) {
      const action = animation.action
      const currentFrame = Math.ceil(getFrame(action.time))

      if (action._clip.name === ANIMATIONS.BBQ.MORT && action.isRunning() && currentFrame === 50) {
        this.instance.block.changeCharacterHead(HEAD.DEAD)
      }

      for (let j = 0; j < animation.frames.length; j++) {
        if (animation.frames[j].frame === currentFrame && animation.frames[j].frame !== animation.lastFrame) {
          // console.log('play', animation.action._clip.name, currentFrame)
          AudioManager.play(animation.frames[j].sound)
        }
      }

      animation.lastFrame = currentFrame
    }
  }
}

export default OrdalieBBQ

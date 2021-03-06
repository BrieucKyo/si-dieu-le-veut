import * as THREE from 'three'
import gsap from 'gsap'

import ANIMATIONS from '@/constants/ANIMATIONS'
import OTHERS from '@/constants/OTHERS'
import SOUNDS from '@/constants/SOUNDS'

import AudioManager from '@/class/three/utils/AudioManager'
import { getFrame } from '@/class/three/utils/Maths'

import WebGL from '@/class/three/WebGL'
import Blocks from '@/class/three/World/Blocks'
import OtherManager from '@/class/three/World/Other/OtherManager'
import Other from '@/class/three/World/Other/Other'

import fragmentShader from '@/class/three/shaders/burning/fragment.glsl'
import vertexShader from '@/class/three/shaders/burning/vertex.glsl'
// import GUI from 'lil-gui'

class OtherSplashscreen {
  private instance: Other
  private followedCharacter = false
  isCharacterMoving = false
  // debugFolder: GUI
  // debugObject: any
  private animation: {
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
  private title: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial | THREE.ShaderMaterial>

  constructor(_other: Other) {
    this.instance = _other

    this.setAnimation()
    this.instance.block.toggleFrustumCulling(false)
    this.setTitle()

    // this.debugObject = {
    //   speedMixer: 10,
    // }

    // if (WebGL.debug.isActive()) {
    //   this.debugFolder = WebGL.debug.addFolder('Croix')
    //   this.debugFolder
    //     .add(this.debugObject, 'speedMixer', 0, 10)
    //     .step(0.1)
    //     .onChange((value: number) => (this.debugObject.speedMixer = value))
    // }
  }

  start() {
    this.playAnimFromOther(OTHERS.SPLASHSCREEN)
    this.fadeInTitle()
  }

  end() {
    this.instance.end()
  }

  private setAnimation() {
    const mixer = new THREE.AnimationMixer(this.instance.block.getModel().scene)

    this.animation = {
      mixer,
      actions: {
        [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[0]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[1]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[2]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[3]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[4]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[5]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[6]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[7]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[8]),
          frames: SOUNDS[OTHERS.SPLASHSCREEN][ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4].frames,
          lastFrame: 0,
        },
      },
      play: (name: string) => {
        this.animation.actions[name].action.play()
      },
    }
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE].action.loop = THREE.LoopRepeat

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE].action.loop = THREE.LoopRepeat

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4].action.loop = THREE.LoopOnce

    // Play the action
    this.animation.mixer.addEventListener('finished', (e) => this.onFinish(e))
  }

  private setTitle() {
    const material = this.instance.block.getModel().scene.children.find((mesh) => mesh.name === 'splashscreen').material
    this.title = this.instance.block.getModel().scene.children.find((mesh) => mesh.name === 'titre')
    this.title.material = material.clone()
    this.title.material.transparent = true
    this.title.material.opacity = 0
  }

  private fadeInTitle() {
    const texture = 'map' in this.title.material ? this.title.material.map : null

    const uniforms = {
      uTexture: { value: texture },
      uNoise: { value: WebGL.resources.getItems('COMMON', 'noise') },
      uGradient: { value: WebGL.resources.getItems('COMMON', 'gradient-4') },
      uDissolve: { value: 1 },
    }

    this.title.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    gsap.to(uniforms.uDissolve, {
      value: 0,
      duration: 5,
      delay: 4.5,
      ease: 'power2.easeOut',
    })
  }

  onFinish(e) {
    this.isCharacterMoving = false

    if (e.action._clip.name === ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1) {
      this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1].action.stop()
      this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE)
      this.end()
    }

    // If behind tutorial
    if (e.action._clip.name === ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3) {
      this.instance.block.moveBehind()
    }

    // If last animation is finished
    if (e.action._clip.name === ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4) {
      this.kill()
    }
  }

  playAnimFromOther(other: OTHERS) {
    this.isCharacterMoving = true

    switch (other) {
      case OTHERS.SPLASHSCREEN:
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1)
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE)
        break
      case OTHERS.CINEMATIC_1:
        // console.log('DO NOT PLAY ON CINEMATIC_1')
        this.isCharacterMoving = false
        break
      case OTHERS.CINEMATIC_2:
        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2].action, 0.03, false)

        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2)

        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE].action.stop()
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2)

        break
      case OTHERS.CINEMATIC_3:
        // console.log('PLAY ON CINEMATIC_3')
        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2].action.stop()
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3)
        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2].action.stop()
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3)
        break
      case OTHERS.TUTORIAL:
        // console.log('PLAY ON TUTORIAL')
        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3].action.stop()
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4)
        this.animation.actions[ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3].action.stop()
        this.animation.play(ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4)
        break
    }
  }

  followCharacter() {
    const characterPosition = this.instance.block.getCharacterRoot().getWorldPosition(new THREE.Vector3())

    // END SPLASHSCREEN IF CHARACTER IS MOVING
    if (characterPosition.x > 0) {
      OtherManager.getCurrent().end()
      if (useStore().isSkippingIntro.value === false) useStore().isSkippingIntro.value = 'hide'
      return (this.followedCharacter = true)
    }
  }

  kill() {
    setTimeout(() => {
      this.instance.block.moveFarBehind()
      this.instance.block.toggleCharacter(false)
      this.instance.block.toggleGarde(false)
      this.instance.block.dipose()
      this.animation.mixer.uncacheRoot(this.instance.block.getModel().scene)
      this.instance.block.moveDefault()
    }, 6000)

    gsap.ticker.remove(this.instance.updateId)

    // Dont hide character immediately if skipping
    if (Blocks.getIsSkippingIntro()) return
    this.instance.block.toggleCharacter(false)
  }

  update() {
    const { deltaTime } = WebGL.time

    this.animation.mixer.update(deltaTime * 0.001)

    for (const animation of Object.values(this.animation.actions)) {
      const time = animation.action.time
      const currentFrame = Math.ceil(getFrame(time))

      for (let j = 0; j < animation.frames.length; j++) {
        if (animation.frames[j].frame === currentFrame && animation.frames[j].frame !== animation.lastFrame) {
          AudioManager.play(animation.frames[j].sound)
        }
      }

      animation.lastFrame = currentFrame
    }

    if (this.followedCharacter) return
    this.followCharacter()
  }
}

export default OtherSplashscreen

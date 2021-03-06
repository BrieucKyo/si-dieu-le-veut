import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap, { SteppedEase } from 'gsap'

import ORDALIES from '@/constants/ORDALIES'
import SOUNDS from '@/constants/SOUNDS'
import ANIMATIONS from '@/constants/ANIMATIONS'
import PATHS from '@/constants/PATHS'
import HEAD from '@/constants/HEAD'
import { FoodInterface } from '@/constants/DIFFICULTY_DATA'

import { getFrame } from '@/class/three/utils/Maths'
import AudioManager from '@/class/three/utils/AudioManager'
import setHTMLPosition from '@/class/three/utils/setHTMLPosition'

import OrdalieManager from '@/class/three/World/Ordalie/OrdalieManager'
import Ordalie from '@/class/three/World/Ordalie/Ordalie'
import WebGL from '@/class/three/WebGL'

import fragmentShader from '@/class/three/shaders/bite/fragment.glsl'
import vertexShader from '@/class/three/shaders/bite/vertex.glsl'

class OrdalieFood {
  instance: Ordalie
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
  debugFolder: GUI
  path: THREE.CatmullRomCurve3
  mesh: THREE.Mesh
  hideMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
  debug: {
    progress: number
    displayTime: number
    maxDisplayTime: number
  }
  paths: THREE.CatmullRomCurve3[]
  geometry: THREE.PlaneGeometry
  material: THREE.ShaderMaterial
  textures: THREE.Texture[]
  biteTexture: THREE.Texture
  difficultyData: FoodInterface
  BASE_PATHS: any[]
  cloneGroup: THREE.Group
  fours: THREE.Mesh[]
  fourIndex: number

  constructor(_ordalie: Ordalie) {
    this.instance = _ordalie
    this.difficultyData = this.instance.block.getDifficultyData() as FoodInterface

    this.debug = {
      progress: 0,
      displayTime: 0,
      maxDisplayTime: 5,
    }

    this.BASE_PATHS = JSON.parse(JSON.stringify(PATHS))

    this.paths = []
    this.changeHideMesh()
    this.setPath()
    this.setAnimation()

    this.cloneGroup = new THREE.Group()
    WebGL.scene.add(this.cloneGroup)

    this.fours = [
      this.instance.block.getModel().scene.children.find((mesh) => mesh.name === 'four1'),
      this.instance.block.getModel().scene.children.find((mesh) => mesh.name === 'four2'),
      this.instance.block.getModel().scene.children.find((mesh) => mesh.name === 'four3'),
    ]

    this.fours[0].visible = true
    this.fours[1].visible = false
    this.fours[2].visible = false

    this.fourIndex = 0
  }

  updateFurnace() {
    if (this.fourIndex === this.fours.length - 1) return

    this.fours[this.fourIndex].visible = false
    this.fourIndex++
    this.fours[this.fourIndex].visible = true
  }

  getRandomPath() {
    return this.paths[Math.floor(Math.random() * this.paths.length)]
  }

  createInstance(path: THREE.CatmullRomCurve3, i: number) {
    const clone = this.mesh.clone()
    clone.scale.set(1.5, 1.5, 1.5)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: this.textures[Math.floor(Math.random() * this.textures.length)] },
        uMask: { value: this.biteTexture },
        uGradient: { value: WebGL.resources.getItems('COMMON', 'gradient') as THREE.Texture },
        uProgress: { value: 4 },
        uAlpha: { value: 0 },
        spriteSheetSize: { value: new THREE.Vector2(320, 64) },
        spriteSize: { value: new THREE.Vector2(64, 64) },
      },
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      depthTest: false,
      transparent: true,
    })

    clone.material = material

    clone.name = 'clone_' + i
    const point = path.getPointAt(1)

    clone.position.set(point.x, point.y, point.z)
    // WebGL.scene.add(clone)
    this.cloneGroup.add(clone)

    gsap.to(material.uniforms.uAlpha, {
      value: 1,
      duration: 0.5,
    })

    return clone
  }

  private setAnimation() {
    const mixer = new THREE.AnimationMixer(this.instance.block.getModel().scene)

    this.animation = {
      mixer,
      actions: {
        [ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[0]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[1]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_CUISINIER_MORT]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[2]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_CUISINIER_MORT].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[3]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[4]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[5]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[6]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT].frames,
          lastFrame: 0,
        },
        [ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE]: {
          action: mixer.clipAction(this.instance.block.getModel().animations[7]),
          frames: SOUNDS[ORDALIES.FOOD][ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE].frames,
          lastFrame: 0,
        },
      },
      play: (name: string) => {
        this.animation.actions[name].action.play()
      },
    }

    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE].action.loop = THREE.LoopOnce

    // this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].action.clampWhenFinished = true
    // this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].action.loop = THREE.LoopRepeat

    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_MORT].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_MORT].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE].action.loop = THREE.LoopOnce

    // this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.clampWhenFinished = true
    // this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.loop = THREE.LoopRepeat

    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT].action.loop = THREE.LoopOnce

    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE].action.clampWhenFinished = true
    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE].action.loop = THREE.LoopOnce

    this.animation.mixer.addEventListener('finished', (e) => this.onFinish(e))
  }

  private changeHideMesh() {
    this.hideMesh = this.instance.block.getModel().scene.children.find((child) => child.name == 'hide')
    this.hideMesh.material.color = new THREE.Color(0xebe2d7)

    // if (WebGL.debug.isActive) {
    //   const folder = WebGL.debug.addFolder('color')
    //   folder.addColor(this.hideMesh.material, 'color')
    // }
  }

  private hideEntonnoir() {
    this.instance.block.getModel().scene.children.find((child) => child.name.includes('Entonnoir')).visible = false
  }

  onFinish(e) {
    if (e.action._clip.name === ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE) {
      this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE].action.stop()
      this.animation.play(ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE)
      this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE].action.stop()
      this.animation.play(ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE)
    }

    if (e.action._clip.name === ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE || e.action._clip.name === ANIMATIONS.FOOD.FOOD_CUISINIER_MORT) {
      this.hideMesh.visible = false
      this.end()
    }
  }

  start() {
    AudioManager.play('ordalie_food_intro')
    this.animation.play(ANIMATIONS.FOOD.FOOD_CUISINIER_ENTREE)
    this.animation.play(ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE)

    // DEBUG
    if (WebGL.debug.isActive()) {
      this.debugFolder = WebGL.debug.addFolder('OrdalieFood')
      // this.debugFolder.add(this.debug, 'progress', 0, 1).step(0.01)
    }

    this.biteTexture = WebGL.resources.getItems(this.instance.block.getType(), 'miam') as THREE.Texture

    this.textures = [WebGL.resources.getItems(this.instance.block.getType(), 'bread') as THREE.Texture, WebGL.resources.getItems(this.instance.block.getType(), 'cheese') as THREE.Texture]

    this.geometry = new THREE.PlaneGeometry(0.05, 0.05)
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  end() {
    if (this.debugFolder) this.debugFolder.destroy()
    this.instance.end()

    if (OrdalieManager.isPlayerDead) return
    this.hideEntonnoir()
  }

  startBiteTransition(mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>) {
    return new Promise<void>((resolve, reject) => {
      gsap.to(mesh.material.uniforms.uProgress, {
        value: 0,
        ease: SteppedEase.config(4),
        duration: 0.5,
        onComplete: () => {
          resolve()
        },
      })
    })
  }

  disposeInstance(name: string) {
    let mesh = this.cloneGroup.children.find((mesh) => mesh.name === name) as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>

    this.cloneGroup.remove(mesh)

    mesh.geometry.dispose()
    mesh.material.dispose()

    mesh = null
  }

  updateHTML(container: HTMLElement, mesh: THREE.Mesh, scale: number) {
    const positions = setHTMLPosition(mesh)
    container.style.transform = `translate3d(${positions.center.x - container.offsetWidth / 2}px,${positions.center.y}px, 0) scale3d(${scale}, ${scale}, ${scale})`
    container.style.fontSize = WebGL.sizes.width / 57.6 + 'px'
  }

  setPath() {
    for (let i = 0; i < this.BASE_PATHS.length; i++) {
      for (let j = 0; j < this.BASE_PATHS[i].length; j++) {
        const x = this.BASE_PATHS[i][j][0]
        const y = this.BASE_PATHS[i][j][1]
        const z = this.BASE_PATHS[i][j][2]
        this.BASE_PATHS[i][j] = new THREE.Vector3(x + this.instance.block.getPosition().x, z, -y)
      }

      this.paths.push(new THREE.CatmullRomCurve3(this.BASE_PATHS[i]))

      // this.instance.block.getModel().scene.attach(this.paths[i])

      // const radius = 0.01
      // const geometry = new THREE.TubeGeometry(this.paths[i], 20, radius, 20, false)
      // const material = new THREE.MeshNormalMaterial({
      //   side: THREE.DoubleSide,
      //   wireframe: true,
      // })
      // const tube = new THREE.Mesh(geometry, material)
      // WebGL.scene.add(tube)
    }
  }

  gameWon() {
    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE].action, 0.03, false)

    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE].action, 0.03, false)

    this.animation.play(ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE)
    // this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.stop()
    this.animation.play(ANIMATIONS.FOOD.FOOD_ENTONNOIR_SORTIE)

    AudioManager.play('ordalie_food_outro')
  }

  gameOver() {
    AudioManager.play('ordalie_food_death')
    this.cloneGroup.traverse((object: THREE.Object3D) => {
      if (object.type === 'Group') return
      const mesh = object as THREE.Mesh
      gsap.to(mesh.material.uniforms.uAlpha, {
        duration: 0.5,
        value: 0,
        onComplete: () => {
          this.disposeInstance(mesh.name)
        },
      })
    })

    this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_MORT].action, 0.03, false)

    this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.crossFadeTo(this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT].action, 0.03, false)

    // this.animation.actions[ANIMATIONS.FOOD.FOOD_CUISINIER_IDLE].action.stop()
    this.animation.play(ANIMATIONS.FOOD.FOOD_CUISINIER_MORT)
    // this.animation.actions[ANIMATIONS.FOOD.FOOD_ENTONNOIR_IDLE].action.stop()
    this.animation.play(ANIMATIONS.FOOD.FOOD_ENTONNOIR_MORT)

    OrdalieManager.setIsDead(true)
  }

  updateMesh(mesh: THREE.Mesh, path: THREE.CatmullRomCurve3, progress: number) {
    const point = path.getPointAt(1 - progress)
    mesh.position.set(point.x, point.y, point.z)
  }

  update() {
    const { deltaTime } = WebGL.time
    this.animation.mixer.update(deltaTime * 0.001 * this.instance.block.getSpeedCoef())

    for (const animation of Object.values(this.animation.actions)) {
      const action = animation.action
      const currentFrame = Math.ceil(getFrame(action.time))

      if (action._clip.name === ANIMATIONS.FOOD.FOOD_ENTONNOIR_ENTREE && action.isRunning() && currentFrame === 40) {
        this.instance.block.changeCharacterHead(HEAD.FOOD)
      }
      if (action._clip.name === ANIMATIONS.FOOD.FOOD_CUISINIER_SORTIE && action.isRunning() && currentFrame === 8) {
        this.instance.block.changeCharacterHead(HEAD.NORMAL)
      }

      if (action._clip.name === ANIMATIONS.FOOD.FOOD_CUISINIER_MORT && action.isRunning() && currentFrame === 1) {
        this.instance.block.changeCharacterHead(HEAD.FOOD_DEAD)
      }

      // for (let j = 0; j < animation.frames.length; j++) {
      //   if (animation.frames[j].frame === currentFrame && animation.frames[j].frame !== animation.lastFrame) {
      //     // console.log('play', animation.action._clip.name, currentFrame)
      //     // AudioManager.play(animation.frames[j].sound)
      //   }
      // }

      animation.lastFrame = currentFrame
    }
  }
}

export default OrdalieFood

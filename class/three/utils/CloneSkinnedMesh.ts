// Vendor
import * as THREE from 'three'

export interface InterfaceCloneSkinnedMesh {
  animations: THREE.AnimationClip[]
  scene: THREE.Scene
}

export default function cloneSkinnedMesh(gltf) {
  const clone: InterfaceCloneSkinnedMesh = {
    animations: gltf.animations,
    scene: gltf.scene.clone(true),
  }

  const skinnedMeshes = {}
  gltf.scene.traverse((node) => {
    if (node.isSkinnedMesh) {
      skinnedMeshes[node.name] = node
    }
  })

  const cloneBones = {}
  const cloneSkinnedMeshes = {}
  clone.scene.traverse((node) => {
    if (node.isBone) {
      cloneBones[node.name] = node
    }
    if (node.isSkinnedMesh) {
      cloneSkinnedMeshes[node.name] = node
    }
  })

  for (const name in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[name]
    const skeleton = skinnedMesh.skeleton
    const cloneSkinnedMesh = cloneSkinnedMeshes[name]
    const orderedCloneBones = []
    for (let i = 0; i < skeleton.bones.length; ++i) {
      const cloneBone = cloneBones[skeleton.bones[i].name]
      orderedCloneBones.push(cloneBone)
    }
    cloneSkinnedMesh.bind(new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses), cloneSkinnedMesh.matrixWorld)
  }

  // // Clone cameras
  // clone.cameras = []

  // for (let i = 0; i < gltf.cameras.length; i++) {
  //   const camera = gltf.cameras[i]
  //   clone.cameras.push(camera.clone())
  // }

  return clone
}

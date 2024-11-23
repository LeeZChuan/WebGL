import { WebGLRenderer, Scene, Camera } from 'three'

export function startAnimation(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  onUpdate: () => void,
) {
  function animate() {
    onUpdate()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()
}

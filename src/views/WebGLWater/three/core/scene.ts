import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three'

export function createScene(canvas: HTMLCanvasElement) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.01, 100)
  camera.position.set(0.426, 0.677, -2.095)

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(canvas.width, canvas.height)
  renderer.setClearColor(new Color('white'))

  return { scene, camera, renderer }
}

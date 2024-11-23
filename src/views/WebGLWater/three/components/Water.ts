import {
  OrthographicCamera,
  PlaneBufferGeometry,
  RawShaderMaterial,
  WebGLRenderTarget,
  Mesh,
} from 'three'
import { loadShader } from '../core/shaders'

export class WaterSimulation {
  private _camera: OrthographicCamera
  private _geometry: PlaneBufferGeometry
  private _dropMesh: Mesh
  private _updateMesh: Mesh
  private _normalMesh: Mesh
  public texture: WebGLRenderTarget

  constructor() {
    this._camera = new OrthographicCamera(0, 1, 1, 0, 0, 2000)
    this._geometry = new PlaneBufferGeometry(2, 2)
    this.texture = new WebGLRenderTarget(256, 256)

    this.initMaterials()
  }

  async initMaterials() {
    const vertexShader = await loadShader('shaders/simulation/vertex.glsl')
    const fragmentShader = await loadShader('shaders/simulation/drop_fragment.glsl')

    const dropMaterial = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        /* uniforms配置 */
      },
    })

    this._dropMesh = new Mesh(this._geometry, dropMaterial)
  }

  addDrop(x: number, y: number, radius: number, strength: number) {
    this._dropMesh.material.uniforms['center'].value = [x, y]
    this._dropMesh.material.uniforms['radius'].value = radius
    this._dropMesh.material.uniforms['strength'].value = strength
    // 触发渲染逻辑
  }
}

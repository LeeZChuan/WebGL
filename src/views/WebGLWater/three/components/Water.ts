import {
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  WebGLRenderTarget,
  Mesh,
  WebGLRenderer,
  Texture,
  FloatType,
} from 'three'
import { loadShader } from '../core/shaders'

export class Water {
  private _camera: OrthographicCamera
  private _geometry: PlaneGeometry
  private _textureA: WebGLRenderTarget
  private _textureB: WebGLRenderTarget
  private _dropMaterial!: RawShaderMaterial
  private _updateMaterial!: RawShaderMaterial
  private _normalMaterial!: RawShaderMaterial
  private _dropMesh!: Mesh
  private _updateMesh!: Mesh
  private _normalMesh!: Mesh

  public texture: WebGLRenderTarget

  constructor() {
    // 初始化正交摄像机
    this._camera = new OrthographicCamera(0, 1, 1, 0, 0, 2000)

    // 初始化平面几何体
    this._geometry = new PlaneGeometry(2, 2)

    // 创建用于水波模拟的纹理
    this._textureA = new WebGLRenderTarget(256, 256, { type: FloatType })
    this._textureB = new WebGLRenderTarget(256, 256, { type: FloatType })
    this.texture = this._textureA

    this.initMaterials()
  }

  async initMaterials() {
    const vertexShader = await loadShader('/shaders/water/vertex.glsl')
    const dropFragmentShader = await loadShader('/shaders/water/drop_fragment.glsl')
    const updateFragmentShader = await loadShader('/shaders/water/update_fragment.glsl')
    const normalFragmentShader = await loadShader('/shaders/water/normal_fragment.glsl')

    // Drop Shader
    this._dropMaterial = new RawShaderMaterial({
      uniforms: {
        center: { value: [0, 0] },
        radius: { value: 0 },
        strength: { value: 0 },
        texture: { value: null },
      },
      vertexShader,
      fragmentShader: dropFragmentShader,
    })

    // Update Shader
    this._updateMaterial = new RawShaderMaterial({
      uniforms: {
        texture: { value: null },
      },
      vertexShader,
      fragmentShader: updateFragmentShader,
    })

    // Normal Shader
    this._normalMaterial = new RawShaderMaterial({
      uniforms: {
        texture: { value: null },
      },
      vertexShader,
      fragmentShader: normalFragmentShader,
    })

    // 创建 Mesh
    this._dropMesh = new Mesh(this._geometry, this._dropMaterial)
    this._updateMesh = new Mesh(this._geometry, this._updateMaterial)
    this._normalMesh = new Mesh(this._geometry, this._normalMaterial)
  }

  addDrop(renderer: WebGLRenderer, x: number, y: number, radius: number, strength: number) {
    this._dropMaterial.uniforms['center'].value = [x, y]
    this._dropMaterial.uniforms['radius'].value = radius
    this._dropMaterial.uniforms['strength'].value = strength

    this._render(renderer, this._dropMesh)
  }

  stepSimulation(renderer: WebGLRenderer) {
    this._render(renderer, this._updateMesh)
  }

  updateNormals(renderer: WebGLRenderer) {
    this._render(renderer, this._normalMesh)
  }

  private _render(renderer: WebGLRenderer, mesh: Mesh) {
    if (!renderer) {
      throw new Error('Renderer is not provided or is null.')
    }

    const oldTexture = this.texture
    const newTexture = this.texture === this._textureA ? this._textureB : this._textureA

    mesh.material.uniforms['texture'].value = oldTexture.texture

    renderer.setRenderTarget(newTexture) // 这里是关键代码
    renderer.render(mesh, this._camera)

    this.texture = newTexture
  }
}

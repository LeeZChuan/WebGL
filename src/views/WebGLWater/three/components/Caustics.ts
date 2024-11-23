import {
  OrthographicCamera,
  PlaneBufferGeometry,
  RawShaderMaterial,
  WebGLRenderTarget,
  Mesh,
  Renderer,
  Texture,
} from 'three'
import { loadShader } from '../core/shaders'

export class Caustics {
  private _camera: OrthographicCamera
  private _geometry: PlaneBufferGeometry
  private _causticMesh!: Mesh
  public texture: WebGLRenderTarget

  constructor(lightFrontGeometry: PlaneBufferGeometry) {
    this._camera = new OrthographicCamera(0, 1, 1, 0, 0, 2000)
    this._geometry = lightFrontGeometry
    this.texture = new WebGLRenderTarget(1024, 1024, { type: THREE.UnsignedByteType })

    this.initMaterial()
  }

  async initMaterial() {
    const vertexShader = await loadShader('shaders/caustics/vertex.glsl')
    const fragmentShader = await loadShader('shaders/caustics/fragment.glsl')

    const material = new RawShaderMaterial({
      uniforms: {
        light: { value: [0.7559, 0.7559, -0.3779] }, // 灯光方向
        water: { value: null }, // 水波纹的纹理
      },
      vertexShader,
      fragmentShader,
    })

    this._causticMesh = new Mesh(this._geometry, material)
  }

  update(renderer: Renderer, waterTexture: Texture) {
    if (!this._causticMesh) return

    // 更新材质的水波纹纹理
    ;(this._causticMesh.material as RawShaderMaterial).uniforms['water'].value = waterTexture

    // 设置渲染目标
    renderer.setRenderTarget(this.texture)
    renderer.setClearColor(0x000000, 0) // 设置透明背景
    renderer.clear()

    // 渲染Caustics
    renderer.render(this._causticMesh, this._camera)
  }
}

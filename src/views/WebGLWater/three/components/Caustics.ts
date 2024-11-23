import {
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  WebGLRenderer,
  WebGLRenderTarget,
  Mesh,
  Texture,
} from 'three'
import { loadShader } from '../core/shaders'

export class Caustics {
  private _camera: OrthographicCamera
  private _geometry: PlaneGeometry
  private _material!: RawShaderMaterial
  private _mesh!: Mesh
  public texture: WebGLRenderTarget

  constructor(lightFrontGeometry: PlaneGeometry) {
    // 正交摄像机用于渲染纹理
    this._camera = new OrthographicCamera(0, 1, 1, 0, 0, 2000)
    this._geometry = lightFrontGeometry

    // 创建渲染目标纹理，用于存储 Caustics 效果
    this.texture = new WebGLRenderTarget(1024, 1024, { type: THREE.UnsignedByteType })

    this.initMaterial()
  }

  async initMaterial() {
    // 异步加载顶点着色器和片段着色器
    const vertexShader = await loadShader('shaders/caustics/vertex.glsl')
    const fragmentShader = await loadShader('shaders/caustics/fragment.glsl')

    // 创建用于光学折射的材质
    this._material = new RawShaderMaterial({
      uniforms: {
        light: { value: [0.7559, 0.7559, -0.3779] }, // 灯光方向
        water: { value: null }, // 输入的水波纹理
      },
      vertexShader,
      fragmentShader,
    })

    // 创建网格，绑定材质和几何体
    this._mesh = new Mesh(this._geometry, this._material)
  }

  /**
   * 更新光学折射纹理
   * @param renderer WebGLRenderer 实例
   * @param waterTexture 水波纹理
   */
  update(renderer: WebGLRenderer, waterTexture: Texture) {
    if (!this._material || !this._mesh) return // 更新水波纹理到材质
    ;(this._material.uniforms['water'] as any).value = waterTexture

    // 设置渲染目标为纹理
    renderer.setRenderTarget(this.texture)
    renderer.setClearColor(0x000000, 0) // 设置透明背景
    renderer.clear()

    // 渲染光学折射到纹理
    renderer.render(this._mesh, this._camera)
  }
}

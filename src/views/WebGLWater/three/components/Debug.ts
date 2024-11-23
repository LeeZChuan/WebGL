import {
  OrthographicCamera,
  PlaneBufferGeometry,
  RawShaderMaterial,
  WebGLRenderer,
  Texture,
  Mesh,
} from 'three'
import { loadShader } from '../core/shaders'

export class Debug {
  private _camera: OrthographicCamera
  private _geometry: PlaneBufferGeometry
  private _material!: RawShaderMaterial
  private _mesh!: Mesh

  constructor() {
    // 初始化一个正交摄像机，适用于2D纹理的渲染
    this._camera = new OrthographicCamera(0, 1, 1, 0, 0, 1)
    this._geometry = new PlaneBufferGeometry()

    this.initMaterial()
  }

  async initMaterial() {
    // 加载顶点和片段着色器
    const vertexShader = await loadShader('shaders/debug/vertex.glsl')
    const fragmentShader = await loadShader('shaders/debug/fragment.glsl')

    // 创建材质
    this._material = new RawShaderMaterial({
      uniforms: {
        texture: { value: null }, // 用于调试的纹理
      },
      vertexShader,
      fragmentShader,
    })

    // 创建一个网格，使用平面几何体和调试材质
    this._mesh = new Mesh(this._geometry, this._material)
  }

  /**
   * 绘制调试信息
   * @param renderer WebGLRenderer 实例
   * @param texture 调试纹理
   */
  draw(renderer: WebGLRenderer, texture: Texture) {
    if (!this._material || !this._mesh) return

    // 更新材质中的纹理
    this._material.uniforms['texture'].value = texture

    // 设置渲染目标为默认的帧缓冲（屏幕）
    renderer.setRenderTarget(null)

    // 渲染调试纹理
    renderer.render(this._mesh, this._camera)
  }
}

import {
  BufferGeometry,
  BufferAttribute,
  RawShaderMaterial,
  WebGLRenderer,
  Mesh,
  OrthographicCamera,
  WebGLRenderTarget,
} from 'three'
import { loadShader } from '../core/shaders'

export class Pool {
  private _geometry: BufferGeometry
  private _material!: RawShaderMaterial
  private _mesh!: Mesh

  constructor() {
    this._geometry = new BufferGeometry()

    // 定义泳池顶点和索引
    const vertices = new Float32Array([
      -1,
      -1,
      -1, // 顶点0
      -1,
      -1,
      1, // 顶点1
      -1,
      1,
      -1, // 顶点2
      -1,
      1,
      1, // 顶点3
      1,
      -1,
      -1, // 顶点4
      1,
      1,
      -1, // 顶点5
      1,
      -1,
      1, // 顶点6
      1,
      1,
      1, // 顶点7
    ])

    const indices = new Uint32Array([
      0,
      1,
      2,
      2,
      1,
      3, // 左面
      4,
      5,
      6,
      6,
      5,
      7, // 右面
      0,
      2,
      4,
      4,
      2,
      5, // 前面
      1,
      3,
      6,
      6,
      3,
      7, // 后面
      2,
      3,
      5,
      5,
      3,
      7, // 顶面
      0,
      1,
      4,
      4,
      1,
      6, // 底面
    ])

    // 将顶点和索引绑定到几何体
    this._geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    this._geometry.setIndex(new BufferAttribute(indices, 1))

    this.initMaterial()
  }

  async initMaterial() {
    const vertexShader = await loadShader('shaders/pool/vertex.glsl')
    const fragmentShader = await loadShader('shaders/pool/fragment.glsl')

    this._material = new RawShaderMaterial({
      uniforms: {
        light: { value: [0.7559, 0.7559, -0.3779] }, // 灯光方向
        tiles: { value: null }, // 瓷砖纹理
        water: { value: null }, // 水波纹理
        causticTex: { value: null }, // 光学折射纹理
      },
      vertexShader,
      fragmentShader,
    })

    this._material.side = THREE.FrontSide // 渲染几何体的前面
    this._mesh = new Mesh(this._geometry, this._material)
  }

  /**
   * 绘制泳池
   * @param renderer WebGLRenderer
   * @param waterTexture 水波纹理
   * @param causticsTexture 光学折射纹理
   */
  draw(
    renderer: WebGLRenderer,
    waterTexture: WebGLRenderTarget,
    causticsTexture: WebGLRenderTarget,
  ) {
    if (!this._material || !this._mesh) return

    // 更新纹理
    this._material.uniforms['water'].value = waterTexture.texture
    this._material.uniforms['causticTex'].value = causticsTexture.texture

    // 渲染到屏幕
    renderer.setRenderTarget(null)
    renderer.render(this._mesh, new OrthographicCamera(-1, 1, 1, -1, 0, 1))
  }
}

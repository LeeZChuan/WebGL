<template>
  <!-- 创建一个 canvas 元素，用于渲染 Three.js 场景 -->
  <canvas ref="canvas" @mousemove="onMouseMove"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

// 定义一个对 canvas 的引用
const canvas = ref<HTMLCanvasElement | null>(null)

// 用于存储鼠标位置的变量
let mouseX = 0,
  mouseY = 0

// 存储球体 Mesh 的变量
let sphere: THREE.Mesh

// 鼠标移动事件，用于实时更新鼠标位置
function onMouseMove(event: MouseEvent) {
  // 将鼠标坐标归一化到 [-1, 1] 范围
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

onMounted(() => {
  if (!canvas.value) return // 如果 canvas 不存在，则不继续初始化

  // 创建场景
  const scene = new THREE.Scene()

  // 创建透视相机
  const camera = new THREE.PerspectiveCamera(
    75, // 视角（FOV）
    window.innerWidth / window.innerHeight, // 宽高比
    0.1, // 近裁剪面
    1000, // 远裁剪面
  )
  camera.position.z = 300 // 将相机移到 z 轴正方向

  // 创建渲染器，并将其绑定到 canvas 上
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value, // 指定渲染目标为 canvas
  })
  renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器尺寸为窗口大小

  // 设置渲染器支持高 DPI（适配 Retina 屏幕等）
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding // 启用伽马校正
  renderer.toneMapping = THREE.ACESFilmicToneMapping // 使用 ACES 色调映射
  renderer.toneMappingExposure = 1.5 // 提高曝光度
  // 加载纹理
  const textureLoader = new THREE.TextureLoader()
  const mapTexture = textureLoader.load('/background.jpg', () => {
    console.log('Texture loaded successfully!')
  })

  // 配置纹理的重复模式，确保贴图可以循环滚动
  mapTexture.wrapS = THREE.RepeatWrapping // 水平方向重复
  mapTexture.wrapT = THREE.RepeatWrapping // 垂直方向重复

  // 创建一个球体几何体，并增加其细分
  // radius: 100, widthSegments: 1024, heightSegments: 1024
  const geometry = new THREE.SphereGeometry(100, 1024, 1024)

  // 创建物理材质，并绑定纹理贴图
  const material = new THREE.MeshPhysicalMaterial({
    map: mapTexture, // 纹理贴图
    color: 0xffffff, // 材质颜色，白色
    metalness: 0.5, // 金属感
    roughness: 0.5, // 表面粗糙度
  })

  // 创建球体 Mesh，将几何体和材质绑定在一起
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere) // 将球体添加到场景中

  // 添加环境光，提供基础的整体照明
  const ambientLight = new THREE.AmbientLight(0xffffff, 2) // 颜色为白色，强度为 2
  scene.add(ambientLight)

  // 添加点光源，用于增强球体的立体感
  const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000) // 白光，强度为 1.5，范围为 1000
  pointLight.position.set(200, 200, 200) // 设置点光源位置
  scene.add(pointLight)

  // 定义贴图旋转的速度和方向
  const rotationSpeed = 0.001 // 每帧的偏移量
  let rotationDirection = 1 // 1: 正向，-1: 反向，0: 停止

  // 添加键盘事件，用于切换旋转方向
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') rotationDirection = 1 // 按右箭头，顺时针旋转
    if (event.key === 'ArrowLeft') rotationDirection = -1 // 按左箭头，逆时针旋转
    if (event.key === ' ') rotationDirection = 0 // 按空格键，停止旋转
  })

  // 动画循环
  function animate() {
    requestAnimationFrame(animate) // 请求下一帧动画

    // 更新纹理的水平偏移，实现贴图滚动
    if (mapTexture) {
      mapTexture.offset.x += rotationSpeed * rotationDirection
    }

    // 渲染场景
    renderer.render(scene, camera)
  }
  animate() // 开始动画

  // 窗口大小变化时，动态调整相机和渲染器
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight // 更新相机宽高比
    camera.updateProjectionMatrix() // 更新相机投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight) // 更新渲染器尺寸
  })
})
</script>

<style lang="scss" scoped>
canvas {
  height: 100%; /* 设置 canvas 的高度为 100% */
  width: 100%; /* 设置 canvas 的宽度为 100% */
  display: block; /* 去掉 canvas 默认的 inline 样式 */
}
</style>

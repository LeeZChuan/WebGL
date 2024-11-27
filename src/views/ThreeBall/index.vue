<template>
  <!-- 创建一个 canvas 元素，用于渲染 Three.js 场景 -->
  <canvas ref="canvas"></canvas>
  <div id="help">
    <h1>摄像机操作</h1>
    <p></p>
    <h2>以下是摄像机的操作提示:</h2>
    <ul>
      <li>双手指可以进行缩放</li>
      <li>点击屏幕然后可以实现旋转</li>
      <li>点击屏幕横向移动是左右旋转</li>
      <li>点击屏幕竖向移动是上下旋转</li>
      <li>键盘的方向键可以实现相机横向平移和纵向平移</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 定义一个对 canvas 的引用
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvas.value) return // 如果 canvas 不存在，则不继续初始化

  // 创建场景
  const scene = new THREE.Scene()

  // 创建透视相机
  const camera = new THREE.PerspectiveCamera(
    70, // 视角（FOV）
    window.innerWidth / window.innerHeight, // 宽高比
    0.1, // 近裁剪面
    1000, // 远裁剪面
  )
  camera.position.z = 400 // 将相机移到 z 轴正方向

  // 创建渲染器，并将其绑定到 canvas 上
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value, // 指定渲染目标为 canvas
    antialias: true, // 开启抗锯齿
  })
  renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器尺寸为窗口大小

  // 设置渲染器支持高 DPI（适配 Retina 屏幕等）
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding // 启用伽马校正
  renderer.toneMapping = THREE.ACESFilmicToneMapping // 使用 ACES 色调映射
  renderer.toneMappingExposure = 1.5 // 提高曝光度

  // 初始化 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 启用阻尼（惯性）
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 200 // 最小缩放距离
  controls.maxDistance = 1000 // 最大缩放距离
  controls.enablePan = true // 启用平移
  controls.enableZoom = true // 启用缩放
  controls.enableRotate = true // 启用旋转

  // 重新绑定鼠标按钮：左键用于平移
  controls.mouseButtons.LEFT = THREE.MOUSE.PAN
  // 禁用右键（可选）
  controls.mouseButtons.RIGHT = THREE.MOUSE.NONE

  // 设置平移和缩放的限制
  controls.minDistance = 200 // 最小缩放距离
  controls.maxDistance = 1000 // 最大缩放距离
  controls.screenSpacePanning = true // 使用屏幕空间平移

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
  const geometry = new THREE.SphereGeometry(100, 32, 32) // 降低细分以提升性能

  // 创建物理材质，并绑定纹理贴图
  const material = new THREE.MeshPhysicalMaterial({
    map: mapTexture, // 纹理贴图
    color: 0xffffff, // 材质颜色，白色
    metalness: 0.5, // 金属感
    roughness: 0.5, // 表面粗糙度
  })

  // 定义一个函数来生成随机位置，范围可以根据需要调整
  function getRandomPosition(maxDistance: number) {
    const x = Math.random() * maxDistance - maxDistance / 2
    const y = (Math.random() * maxDistance) / 2 + 50 // 确保球体在空中
    const z = Math.random() * maxDistance - maxDistance / 2
    return new THREE.Vector3(x, y, z)
  }

  // 创建球体 Mesh，将几何体和材质绑定在一起
  for (let i = 0; i < 1; i++) { // 修改为生成五个球体
    const sphere = new THREE.Mesh(geometry, material) as THREE.Mesh
    const position = getRandomPosition(200) // 最大距离设置为200
    sphere.position.set(position.x, position.y, position.z)
    scene.add(sphere)
  }

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

  // 定义键盘控制变量
  interface Movement {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    up: boolean
    down: boolean
  }

  const movement: Movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  }

  // 定义移动速度（单位：每秒移动多少）
  const moveSpeed = 200 // 可根据需要调整

  // 定义移动范围
  const boundary = {
    xMin: -500,
    xMax: 500,
    yMin: -500,
    yMax: 500,
    zMin: 200,
    zMax: 1000,
  }

  // 添加键盘事件，用于移动摄像头
  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movement.forward = true
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        movement.backward = true
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movement.left = true
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        movement.right = true
        break
      case 'q':
      case 'Q':
        movement.up = true
        break
      case 'e':
      case 'E':
        movement.down = true
        break
      default:
        break
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movement.forward = false
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        movement.backward = false
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movement.left = false
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        movement.right = false
        break
      case 'q':
      case 'Q':
        movement.up = false
        break
      case 'e':
      case 'E':
        movement.down = false
        break
      default:
        break
    }
  }

  // 添加事件监听器
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  // 在组件卸载时移除事件监听器
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
  })

  // 动画循环
  let previousTime = performance.now()

  function animate() {
    requestAnimationFrame(animate) // 请求下一帧动画
    controls.update() // 仅在启用阻尼时需要

    // 更新纹理的水平偏移，实现贴图滚动
    if (mapTexture) {
      mapTexture.offset.x += rotationSpeed * rotationDirection
    }

    // 计算时间差（秒）
    const currentTime = performance.now()
    const deltaTime = (currentTime - previousTime) / 1000
    previousTime = currentTime

    // 计算实际移动距离
    const actualMoveSpeed = moveSpeed * deltaTime

    // 计算摄像机的方向向量（前方向）
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction).normalize()

    // 计算右方向向量
    const right = new THREE.Vector3()
    right.crossVectors(direction, camera.up).normalize()

    // 计算上方向向量
    const up = new THREE.Vector3()
    up.copy(camera.up).normalize()

    // 根据键盘输入调整摄像机和控制器的目标位置
    if (movement.forward) {
      camera.position.addScaledVector(direction, actualMoveSpeed)
      controls.target.addScaledVector(direction, actualMoveSpeed)
    }
    if (movement.backward) {
      camera.position.addScaledVector(direction, -actualMoveSpeed)
      controls.target.addScaledVector(direction, -actualMoveSpeed)
    }
    if (movement.left) {
      camera.position.addScaledVector(right, -actualMoveSpeed)
      controls.target.addScaledVector(right, -actualMoveSpeed)
    }
    if (movement.right) {
      camera.position.addScaledVector(right, actualMoveSpeed)
      controls.target.addScaledVector(right, actualMoveSpeed)
    }
    if (movement.up) {
      camera.position.addScaledVector(up, actualMoveSpeed)
      controls.target.addScaledVector(up, actualMoveSpeed)
    }
    if (movement.down) {
      camera.position.addScaledVector(up, -actualMoveSpeed)
      controls.target.addScaledVector(up, -actualMoveSpeed)
    }

    // 限制摄像机和控制器目标的位置在边界内
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, boundary.xMin, boundary.xMax)
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, boundary.yMin, boundary.yMax)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, boundary.zMin, boundary.zMax)

    controls.target.x = THREE.MathUtils.clamp(controls.target.x, boundary.xMin, boundary.xMax)
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, boundary.yMin, boundary.yMax)
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, boundary.zMin, boundary.zMax)

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

ul {
  color: aliceblue;
  padding: 0 0 0 20px;
}
h1 {
  color: aliceblue;
  font: bold italic 30px/30px Georgia;
  text-align: center;
}
h2 {
  color: aliceblue;
  font: bold italic 17px/17px Georgia;
  padding-top: 10px;
}
#help {
  color: aliceblue;
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 280px;
  padding-right: 20px;
  z-index: 100;
}
</style>
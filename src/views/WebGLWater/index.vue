<template>
  <canvas ref="canvas" @mousemove="onMouseMove"></canvas>
  <div id="loading" ref="loading">Loading...</div>
  <div id="help">
    <h1>WebGL Water</h1>
    <p>An experiment heavily based on code by <a href="http://madebyevan.com/">Evan Wallace</a></p>
    <h2>Interactions:</h2>
    <ul>
      <li>Draw on the water to make ripples</li>
      <li>Drag the background to rotate the camera</li>
      <li>Press SPACEBAR to pause and unpause</li>
      <li>Drag the sphere to move it around</li>
      <li>Press the L key to set the light direction</li>
      <li>Press the G key to toggle gravity</li>
      <li>Mouse wheel forward and backward to control zoom</li>
    </ul>
  </div>
  <img id="tiles" src="@/imgs/water/tile.jpg" />
  <img id="xneg" src="@/imgs/water/nx.jpg" />
  <img id="xpos" src="@/imgs/water/px.jpg" />
  <img id="ypos" src="@/imgs/water/py.jpg" />
  <img id="zneg" src="@/imgs/water/nz.jpg" />
  <img id="zpos" src="@/imgs/water/pz.jpg" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createScene } from '@/three/core/scene'
import { WaterSimulation } from '@/three/components/Water'
import { Caustics } from '@/three/components/Caustics'
import { startAnimation } from '@/three/animations/mainLoop'
import { PlaneBufferGeometry } from 'three'

// 响应式Canvas引用
const canvas = ref<HTMLCanvasElement | null>(null)

// 模块实例
let waterSimulation: WaterSimulation
let caustics: Caustics

// 鼠标交互相关
const mouse = { x: 0, y: 0 }
function onMouseMove(event: MouseEvent) {
  if (!canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1

  // 使用鼠标位置与水波模拟交互
  waterSimulation.addDrop(null, mouse.x, mouse.y, 0.03, 0.04)
}

// Vue生命周期钩子
onMounted(() => {
  if (!canvas.value) return
  console.log(createScene, 'createScene')

  // 初始化Three.js场景
  const { scene, camera, renderer } = createScene(canvas.value)
  console.log(scene, camera, renderer)

  // 初始化水波模拟
  waterSimulation = new WaterSimulation()

  // 初始化光学折射
  const lightFrontGeometry = new PlaneBufferGeometry(2, 2)
  caustics = new Caustics(lightFrontGeometry)

  // 开始渲染循环
  startAnimation(renderer, scene, camera, () => {
    // 更新水波模拟
    waterSimulation.stepSimulation(renderer)
    waterSimulation.updateNormals(renderer)

    // 获取水波纹理
    const waterTexture = waterSimulation.texture.texture

    // 更新光学折射
    caustics.update(renderer, waterTexture)

    // 获取Caustics纹理
    const causticsTexture = caustics.texture.texture

    // 示例：在场景中渲染水面和Caustics效果（如果有其他组件可在此使用）
    // water.draw(renderer, waterTexture, causticsTexture);
    // pool.draw(renderer, waterTexture, causticsTexture);
  })
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

<style scoped>
img {
  display: none;
}
ul {
  padding: 0 0 0 20px;
}
h1 {
  font: bold italic 30px/30px Georgia;
  text-align: center;
}
h2 {
  font: bold italic 17px/17px Georgia;
  padding-top: 10px;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
#help {
  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  width: 280px;
  padding-right: 20px;
  z-index: 100;
}
#loading {
  position: absolute;
  left: 0;
  top: 50%;
  right: 300px;
  text-align: center;
  margin-top: -8px;
}
</style>

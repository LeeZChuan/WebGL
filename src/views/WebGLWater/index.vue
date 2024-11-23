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
import { createScene } from '@/views/WebGLWater/three/core/scene'
import { Water } from '@/views/WebGLWater/three/components/Water'
import { startAnimation } from '@/views/WebGLWater/three/animations/mainLoop'

// 响应式Canvas引用
const canvas = ref<HTMLCanvasElement | null>(null)

// 模块实例
let waterSimulation: Water

// 鼠标交互相关
const mouse = { x: 0, y: 0 }

function onMouseMove(event: MouseEvent) {
  if (!canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1

  // 触发水波模拟
  waterSimulation.addDrop(null, mouse.x, mouse.y, 0.03, 0.04)
}

onMounted(async () => {
  if (!canvas.value) return

  const { scene, camera, renderer } = createScene(canvas.value)

  waterSimulation = new Water()
  await waterSimulation.initMaterials()

  // 开始动画
  startAnimation(renderer, scene, camera, () => {
    waterSimulation.stepSimulation(renderer)
    waterSimulation.updateNormals(renderer)
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

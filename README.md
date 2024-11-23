# WebGL

在Vue3项目中实践WebGL

## Project Structure

```
|-- public
|   |-- index.html
|-- src
|   |-- assets
|   |-- components
|   |-- views
|   |-- App.vue
|   |-- main.js
|-- .gitignore
|-- babel.config.js
|-- package.json
|-- README.md
|-- tsconfig.json
|-- vite.config.ts
```

## WebGLWater 代码结构

```
src/
├── three/
│   ├── core/
│   │   ├── scene.ts           # 场景、相机、渲染器初始化
│   │   ├── shaders.ts         # 自定义Shader加载模块
│   │   ├── controls.ts        # 鼠标交互模块
│   │   ├── utils.ts           # 工具模块
│   ├── components/
│   │   ├── Water.ts           # 水波组件逻辑
│   │   ├── Caustics.ts        # 光学折射组件逻辑
│   │   ├── Pool.ts            # 游泳池几何体逻辑
│   │   ├── Debug.ts           # 调试模块
│   ├── animations/
│   │   ├── mainLoop.ts        # 主渲染循环
├── components/
│   ├── ThreeScene.vue         # Vue 主场景组件
│   ├── DebugComponent.vue     # Vue 调试组件
│   ├── WaterComponent.vue     # Vue 水波组件
└── main.ts                    # Vue 入口文件
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

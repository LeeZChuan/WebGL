import { PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export interface ControlsOptions {
  enableDamping?: boolean; // 是否启用阻尼效果
  dampingFactor?: number; // 阻尼因子
  screenSpacePanning?: boolean; // 是否允许屏幕空间平移
  maxPolarAngle?: number; // 最大俯视角（限制垂直旋转范围）
  minPolarAngle?: number; // 最小俯视角
  enableZoom?: boolean; // 是否允许缩放
  zoomSpeed?: number; // 缩放速度
  rotateSpeed?: number; // 旋转速度
  panSpeed?: number; // 平移速度
}

/**
 * 初始化鼠标控制器
 * @param camera - Three.js 的摄像机
 * @param renderer - Three.js 的渲染器
 * @param options - 可选的控制器配置参数
 * @returns OrbitControls 实例
 */
export function initializeControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  options: ControlsOptions = {}
): OrbitControls {
  // 创建 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);

  // 配置默认值和用户传入的选项
  controls.enableDamping = options.enableDamping ?? true; // 默认开启阻尼
  controls.dampingFactor = options.dampingFactor ?? 0.1; // 默认阻尼因子
  controls.screenSpacePanning = options.screenSpacePanning ?? false; // 禁止屏幕空间平移
  controls.maxPolarAngle = options.maxPolarAngle ?? Math.PI / 2; // 默认最大俯视角
  controls.minPolarAngle = options.minPolarAngle ?? 0; // 默认最小俯视角
  controls.enableZoom = options.enableZoom ?? true; // 默认允许缩放
  controls.zoomSpeed = options.zoomSpeed ?? 1.0; // 默认缩放速度
  controls.rotateSpeed = options.rotateSpeed ?? 1.0; // 默认旋转速度
  controls.panSpeed = options.panSpeed ?? 1.0; // 默认平移速度

  return controls;
}
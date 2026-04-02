<template>
  <div class="scene-container">
    <div ref="canvasContainer" class="canvas-wrapper"></div>
    <div class="overlay">
      <h1 class="title">星空粒子特效</h1>
      <p class="subtitle">Three.js 3D 交互体验</p>
      <div class="info">
        <p>鼠标移动粒子会跟随</p>
        <p>点击切换粒子形状</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

interface MouseEvent {
  clientX: number
  clientY: number
}

interface Node {
  nodeType: number
}

interface HTMLElement {
  appendChild(node: Node): Node
}

const canvasContainer = ref<HTMLElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let particles: THREE.Points | null = null
let animationId: number | null = null
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0
let currentShape = 0
const shapes = ['sphere', 'torus', 'helix', 'grid']

function init() {
  const container = canvasContainer.value
  if (!container) return

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 50

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  createParticles()

  window.addEventListener('resize', onWindowResize)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', changeShape)

  animate()
}

function createParticles() {
  const particleCount = 5000
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const { x, y, z } = getPosition(i, particleCount)
    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z

    const color = new THREE.Color()
    color.setHSL((i / particleCount) * 0.8 + 0.1, 0.8, 0.6)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(geometry, material)
  scene?.add(particles)
}

function getPosition(index: number, total: number) {
  const shape = shapes[currentShape]
  const phi = Math.acos(-1 + (2 * index) / total)
  const theta = Math.sqrt(total * Math.PI) * phi

  switch (shape) {
    case 'sphere': {
      const radius = 20
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      }
    }
    case 'torus': {
      const R = 15
      const r = 8
      const u = (index / total) * Math.PI * 2 * 5
      const v = (index / total) * Math.PI * 2 * 10
      return {
        x: (R + r * Math.cos(v)) * Math.cos(u),
        y: (R + r * Math.cos(v)) * Math.sin(u),
        z: r * Math.sin(v)
      }
    }
    case 'helix': {
      const radius = 15
      const height = 40
      const t = (index / total) * Math.PI * 8
      return {
        x: radius * Math.cos(t),
        y: (index / total) * height - height / 2,
        z: radius * Math.sin(t)
      }
    }
    case 'grid': {
      const size = 30
      const gridSize = Math.sqrt(total)
      const row = Math.floor(index / gridSize)
      const col = index % gridSize
      return {
        x: (col / gridSize - 0.5) * size,
        y: (row / gridSize - 0.5) * size,
        z: Math.sin(col * 0.5) * Math.cos(row * 0.5) * 5
      }
    }
    default:
      return { x: 0, y: 0, z: 0 }
  }
}

function changeShape() {
  if (!particles) return

  currentShape = (currentShape + 1) % shapes.length

  const geometry = particles.geometry
  const positionAttribute = geometry.attributes.position
  if (!positionAttribute) return
  const positions = positionAttribute.array as Float32Array
  const particleCount = positions.length / 3

  for (let i = 0; i < particleCount; i++) {
    const { x, y, z } = getPosition(i, particleCount)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }

  positionAttribute.needsUpdate = true
}

function onMouseMove(event: MouseEvent) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

function onWindowResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  animationId = window.requestAnimationFrame(animate)

  if (!particles || !camera) return

  targetX += (mouseX - targetX) * 0.05
  targetY += (mouseY - targetY) * 0.05

  particles.rotation.y += 0.002
  particles.rotation.x += 0.001

  particles.rotation.y += targetX * 0.02
  particles.rotation.x += targetY * 0.02

  const positionAttribute = particles.geometry.attributes.position
  if (positionAttribute && positionAttribute.array) {
    const positions = positionAttribute.array as Float32Array
    for (let j = 0; j + 1 < positions.length; j += 3) {
      const time = Date.now() * 0.001
      const yIndex = j + 1
      const xValue = positions[j]
      if (yIndex < positions.length && xValue !== undefined && positions[yIndex] !== undefined) {
        positions[yIndex] += Math.sin(time + xValue * 0.1) * 0.02
      }
    }
    positionAttribute.needsUpdate = true
  }

  renderer?.render(scene!, camera!)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (animationId) window.cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('click', changeShape)
  renderer?.dispose()
  scene?.clear()
})
</script>

<style scoped lang="scss">
.scene-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0c0c1e 100%);
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 10;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow:
    0 0 20px rgba(100, 150, 255, 0.8),
    0 0 40px rgba(100, 150, 255, 0.6),
    0 0 60px rgba(100, 150, 255, 0.4);
  margin-bottom: 0.5rem;
  letter-spacing: 0.3em;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow:
      0 0 20px rgba(100, 150, 255, 0.8),
      0 0 40px rgba(100, 150, 255, 0.6);
  }
  to {
    text-shadow:
      0 0 30px rgba(150, 200, 255, 1),
      0 0 60px rgba(150, 200, 255, 0.8),
      0 0 90px rgba(150, 200, 255, 0.6);
  }
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  letter-spacing: 0.2em;
}

.info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    margin: 0.5rem 0;
    letter-spacing: 0.05em;
  }
}
</style>

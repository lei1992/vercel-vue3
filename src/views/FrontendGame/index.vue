<template>
  <div class="game-container">
    <div ref="canvasContainer" class="canvas-wrapper"></div>

    <div class="game-ui">
      <div class="game-header">
        <div class="level-info">
          <span class="level-label">关卡</span>
          <span class="level-number">{{ currentLevel + 1 }}/{{ levels.length }}</span>
        </div>
        <div class="score-info">
          <span class="score-label">得分</span>
          <span class="score-number">{{ score }}</span>
        </div>
      </div>

      <div v-if="gameState === 'start'" class="game-panel start-panel">
        <h2 class="panel-title">前端知识大闯关</h2>
        <p class="panel-description">通过回答前端相关问题，帮助小球收集星星！</p>
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">总关卡数</span>
            <span class="info-value">{{ levels.length }} 个</span>
          </div>
          <div class="info-item">
            <span class="info-label">每关题目</span>
            <span class="info-value">2 道</span>
          </div>
          <div class="info-item">
            <span class="info-label">总题目数</span>
            <span class="info-value">{{ levels.length * 2 }} 道</span>
          </div>
        </div>
        <div class="game-rules">
          <h4 class="rules-title">📜 游戏规则</h4>
          <ul class="rules-list">
            <li>每关包含 2 道前端知识题目</li>
            <li>选择正确答案获得 10 分</li>
            <li>完成每关后可选择继续挑战或重新开始</li>
            <li>答错不扣分，正确答案会显示解析</li>
          </ul>
        </div>
        <button class="game-btn" @click="startGame">开始游戏</button>
      </div>

      <div v-if="gameState === 'question'" class="game-panel question-panel">
        <div class="question-content">
          <div class="question-icon">❓</div>
          <h3 class="question-title">{{ currentQuestion?.question }}</h3>
          <div v-if="currentQuestion" class="options-list">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-item"
              :class="getOptionClass(index)"
              @click="selectAnswer(index)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
              <span class="option-text">{{ option }}</span>
              <span v-if="showResult" class="option-icon">{{ getOptionIcon(index) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="gameState === 'result'" class="game-panel result-panel">
        <div class="result-icon">{{ isCorrect ? '✅' : '❌' }}</div>
        <h3 class="result-title">{{ isCorrect ? '回答正确！' : '回答错误' }}</h3>
        <p v-if="currentQuestion?.explanation" class="explanation">
          {{ currentQuestion.explanation }}
        </p>
        <button class="game-btn" @click="nextQuestion">
          {{ isLastQuestion ? '查看关卡成绩' : '下一题' }}
        </button>
      </div>

      <div v-if="gameState === 'level_complete'" class="game-panel level-complete-panel">
        <div class="level-complete-icon">🎉</div>
        <h3 class="level-complete-title">关卡挑战通过！</h3>
        <div class="level-score">
          <span class="level-score-label">关卡得分</span>
          <span class="level-score-value">{{ getLevelScore() }}</span>
        </div>
        <p class="level-complete-description">
          恭喜完成第 {{ currentLevel + 1 }} 关！是否继续挑战下一关？
        </p>
        <div class="level-complete-buttons">
          <button class="game-btn secondary" @click="restartGame">重新开始</button>
          <button class="game-btn" @click="nextLevel">下一关</button>
        </div>
      </div>

      <div v-if="gameState === 'complete'" class="game-panel complete-panel">
        <div class="complete-icon">🏆</div>
        <h3 class="complete-title">游戏结束！</h3>
        <div class="final-score">
          <span class="final-label">最终得分</span>
          <span class="final-number">{{ score }}</span>
        </div>
        <div class="correct-rate">
          <span class="rate-label">正确率</span>
          <span class="rate-number">{{ correctRate }}%</span>
        </div>
        <div class="evaluation">{{ getEvaluation() }}</div>
        <button class="game-btn" @click="restartGame">重新挑战</button>
      </div>
    </div>

    <div class="star-display">
      <el-rate v-model="startValue" disabled text-color="#ff9900" size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

interface Level {
  questions: Question[]
}

const canvasContainer = ref<HTMLElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let ball: THREE.Mesh | null = null
let stars: THREE.Mesh[] = []
let animationId: number | null = null
let targetRotationX = 0
let targetRotationY = 0

const gameState = ref<'start' | 'question' | 'result' | 'level_complete' | 'complete'>('start')
const currentLevel = ref(0)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const score = ref(0)
const correctAnswers = ref(0)
const totalQuestions = ref(0)
const collectedStars = ref<number[]>([0, 0, 0, 0, 0])

const levels: Level[] = [
  {
    questions: [
      {
        question: 'HTML 中创建超链接的标签是？',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctIndex: 1,
        explanation: '<a> 标签用于定义超链接，href 属性指定链接地址。'
      },
      {
        question: 'CSS 中使元素居中的方法是？',
        options: [
          'align: center',
          'text-align: center',
          'display: flex + justify-content',
          'position: absolute'
        ],
        correctIndex: 2,
        explanation: '使用 display: flex 和 justify-content: center 是最现代的居中方式。'
      }
    ]
  },
  {
    questions: [
      {
        question: 'Vue 3 中用于响应式状态的 API 是？',
        options: ['reactive()', 'createRef()', 'useState()', 'useEffect()'],
        correctIndex: 0,
        explanation: 'reactive() 用于创建响应式对象，ref() 用于创建响应式基本类型。'
      },
      {
        question: 'JavaScript 中数组的 map 方法返回什么？',
        options: ['修改原数组', 'undefined', '新数组', '原数组的引用'],
        correctIndex: 2,
        explanation: 'map 方法返回一个新数组，不改变原数组。'
      }
    ]
  },
  {
    questions: [
      {
        question: 'TypeScript 中用于定义可选属性的符号是？',
        options: ['!', '?', '&', '|'],
        correctIndex: 1,
        explanation: '使用 ? 符号可以定义可选属性，例如 name?: string。'
      },
      {
        question: 'CSS 中 z-index 属性的作用是？',
        options: ['控制透明度', '控制缩放', '控制层级', '控制位置'],
        correctIndex: 2,
        explanation: 'z-index 控制元素的堆叠顺序，值越大层级越高。'
      }
    ]
  },
  {
    questions: [
      {
        question: 'Vue 3 生命周期中，onMounted 在何时触发？',
        options: ['组件创建前', 'DOM 挂载后', '组件更新前', '组件销毁时'],
        correctIndex: 1,
        explanation: 'onMounted 在组件 DOM 挂载完成后触发，适合执行 DOM 操作和 API 调用。'
      },
      {
        question: 'CSS 中 flex: 1 是什么的简写？',
        options: [
          'flex-grow',
          'flex-grow: 1; flex-shrink: 1; flex-basis: 0%',
          'flex-direction',
          'flex-wrap'
        ],
        correctIndex: 1,
        explanation: 'flex: 1 是 flex-grow: 1; flex-shrink: 1; flex-basis: 0% 的简写。'
      }
    ]
  }
  //   {
  //     questions: [
  //       {
  //         question: 'Three.js 中用于创建场景的类是？',
  //         options: ['Scene', 'Camera', 'Renderer', 'Mesh'],
  //         correctIndex: 0,
  //         explanation: 'THREE.Scene 用于创建场景，是所有 3D 对象的容器。'
  //       },
  //       {
  //         question: 'JavaScript 中 Promise.all 的作用是？',
  //         options: ['按顺序执行', '并行执行并等待所有完成', '只返回第一个', '取消所有请求'],
  //         correctIndex: 1,
  //         explanation: 'Promise.all 并行执行所有 Promise，等待所有完成后返回结果数组。'
  //       }
  //     ]
  //   }
]

const currentQuestion = computed(() => {
  const level = levels[currentLevel.value]
  if (!level || !level.questions[currentQuestionIndex.value]) {
    return null
  }
  return level.questions[currentQuestionIndex.value]
})

const isCorrect = computed(() => {
  if (!currentQuestion.value) return false
  return selectedAnswer.value === currentQuestion.value.correctIndex
})

const isLastQuestion = computed(() => {
  const level = levels[currentLevel.value]
  if (!level) return true
  return currentQuestionIndex.value >= level.questions.length - 1
})

const correctRate = computed(() => {
  return totalQuestions.value > 0
    ? Math.round((correctAnswers.value / totalQuestions.value) * 100)
    : 0
})

const startValue = computed(() => {
  if (totalQuestions.value === 0) return 0
  return (score.value / 10 / (levels.length * 2)) * 5
})

function init() {
  const container = canvasContainer.value
  if (!container) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  createBall()
  createStars()
  createLighting()

  window.addEventListener('resize', onWindowResize)
  document.addEventListener('mousemove', onMouseMove)

  animate()
}

function createBall() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32)
  const material = new THREE.MeshPhongMaterial({
    color: 0x667eea,
    shininess: 100,
    emissive: 0x222244
  })
  ball = new THREE.Mesh(geometry, material)
  ball.position.set(0, 0, 0)
  scene?.add(ball)
}

function createStars() {
  const starGeometry = new THREE.OctahedronGeometry(0.3, 0)
  const starMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    emissive: 0xffa500,
    shininess: 50
  })

  for (let i = 0; i < 5; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial.clone())
    const angle = (i / 5) * Math.PI * 2
    const radius = 2.5
    star.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    stars.push(star)
    scene?.add(star)
  }
}

function createLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene?.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1, 100)
  pointLight.position.set(5, 5, 5)
  scene?.add(pointLight)

  const pointLight2 = new THREE.PointLight(0x667eea, 0.5, 100)
  pointLight2.position.set(-5, -5, 5)
  scene?.add(pointLight2)
}

function onMouseMove(event: MouseEvent) {
  targetRotationX = (event.clientY / window.innerHeight - 0.5) * 2
  targetRotationY = (event.clientX / window.innerWidth - 0.5) * 2
}

function onWindowResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  animationId = window.requestAnimationFrame(animate)

  if (ball) {
    ball.rotation.x += 0.01
    ball.rotation.y += 0.01
    ball.rotation.x += (targetRotationX * 0.5 - ball.rotation.x) * 0.05
    ball.rotation.y += (targetRotationY * 0.5 - ball.rotation.y) * 0.05
  }

  stars.forEach((star, index) => {
    star.rotation.y += 0.02
    star.position.y += Math.sin(Date.now() * 0.002 + index) * 0.005
    const progress = collectedStars.value[index] ?? 0
    if (progress >= 1) {
      star.scale.setScalar(star.scale.x * 0.95)
      star.visible = star.scale.x > 0.1
    }
  })

  renderer?.render(scene!, camera!)
}

function startGame() {
  gameState.value = 'question'
}

function selectAnswer(index: number) {
  if (showResult.value || !currentQuestion.value) return
  selectedAnswer.value = index
  showResult.value = true
  gameState.value = 'result'

  totalQuestions.value++

  if (index === currentQuestion.value.correctIndex) {
    score.value += 10
    correctAnswers.value++
  }

  updateStars()
}

function updateStars() {
  if (totalQuestions.value === 0) return

  const totalQuestionsCount = levels.length * 2
  const totalProgress = correctAnswers.value / totalQuestionsCount

  for (let i = 0; i < collectedStars.value.length; i++) {
    const starStart = i / 5
    const starEnd = (i + 1) / 5

    if (totalProgress <= starStart) {
      collectedStars.value[i] = 0
    } else if (totalProgress >= starEnd) {
      collectedStars.value[i] = 1
    } else {
      collectedStars.value[i] = (totalProgress - starStart) / (starEnd - starStart)
    }
  }
}

function nextQuestion() {
  showResult.value = false
  selectedAnswer.value = null

  if (isLastQuestion.value) {
    if (currentLevel.value >= levels.length - 1) {
      gameState.value = 'complete'
    } else {
      gameState.value = 'level_complete'
    }
  } else {
    currentQuestionIndex.value++
    gameState.value = 'question'
  }
}

function nextLevel() {
  showResult.value = false
  selectedAnswer.value = null
  currentLevel.value++
  currentQuestionIndex.value = 0
  gameState.value = 'question'
}

function getLevelScore() {
  return score.value
}

function getOptionClass(index: number) {
  if (!showResult.value || !currentQuestion.value) return ''
  if (index === currentQuestion.value.correctIndex) return 'correct'
  if (index === selectedAnswer.value) return 'wrong'
  return ''
}

function getOptionIcon(index: number) {
  if (!currentQuestion.value) return ''
  if (index === currentQuestion.value.correctIndex) return '✓'
  if (index === selectedAnswer.value) return '✗'
  return ''
}

function getEvaluation() {
  const rate = correctRate.value
  if (rate === 100) return '🎉 完美！你是前端大师！'
  if (rate >= 80) return '👏 优秀！继续加油！'
  if (rate >= 60) return '👍 良好！再接再厉！'
  return '💪 加油！多学习前端知识吧！'
}

function restartGame() {
  gameState.value = 'start'
  currentLevel.value = 0
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  score.value = 0
  correctAnswers.value = 0
  totalQuestions.value = 0
  collectedStars.value = [0, 0, 0, 0, 0]

  stars.forEach((star) => {
    star.scale.setScalar(1)
    star.visible = true
  })
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (animationId) window.cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mousemove', onMouseMove)
  renderer?.dispose()
  scene?.clear()
})
</script>

<style scoped lang="scss">
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.game-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
}

.level-info,
.score-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.level-label,
.score-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
}

.level-number,
.score-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.game-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.start-panel {
  text-align: center;
}

.panel-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.panel-description {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  line-height: 1.6;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
}

.game-rules {
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  text-align: left;
}

.rules-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  text-align: center;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rules-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;

  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: 700;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.question-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 32px;
  line-height: 1.4;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(8px);
  }

  &.correct {
    background: rgba(72, 187, 120, 0.2);
    border-color: #48bb78;
  }

  &.wrong {
    background: rgba(245, 101, 101, 0.2);
    border-color: #f56565;
  }
}

.option-letter {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.option-icon {
  font-size: 1.5rem;
  font-weight: 700;
}

.result-panel {
  text-align: center;
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.result-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.explanation {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 32px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
}

.level-complete-panel {
  text-align: center;
}

.level-complete-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.level-complete-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
}

.level-score {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.level-score-label {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
}

.level-score-value {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.level-complete-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 32px;
}

.level-complete-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.game-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
}

.complete-panel {
  text-align: center;
}

.complete-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.complete-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 32px;
}

.final-score,
.correct-rate {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.final-label,
.rate-label {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
}

.final-number,
.rate-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.evaluation {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.game-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
}

.star-display {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  padding: 16px 8px 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;

  :deep(.el-rate__icon) {
    font-size: 36px !important;
    margin-right: 24px;
  }
}

.star {
  position: relative;
  font-size: 2rem;
  opacity: 0.3;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .star-svg {
    width: 2rem;
    height: 2rem;
    transition: all 0.3s ease;
  }

  .star-path-bg {
    fill: rgba(255, 255, 255, 0.3);
  }

  .star-path-fill {
    fill: #ffd700;
  }

  &.active {
    opacity: 0.8;
  }

  &.completed {
    opacity: 1;
    transform: scale(1.2);

    .star-svg {
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
    }
  }
}
</style>

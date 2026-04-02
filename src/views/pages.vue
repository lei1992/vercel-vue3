<template>
  <div class="pages-container">
    <div class="animated-background">
      <div v-for="i in 20" :key="i" class="floating-particle" :style="getParticleStyle(i)"></div>
    </div>
    <div class="content-wrapper">
      <h1 class="title">
        <span
          class="title-letter"
          v-for="(letter, index) in titleText"
          :key="index"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ letter }}
        </span>
      </h1>
      <div class="page-list">
        <div
          v-for="(page, index) in pageList"
          :key="page.name"
          class="page-item"
          @click="navigateTo(page.path)"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="page-icon">
            <div class="icon-glow"></div>
            <span class="icon-number">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>
          <div class="page-content">
            <span class="page-name">{{ page.name }}</span>
            <span class="page-path">{{ page.path }}</span>
          </div>
          <div class="page-arrow">
            <div class="arrow-icon">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Page {
  name: string
  path: string
}

const router = useRouter()

const titleText = '页面导航'.split('')

const pageList: Page[] = [
  { name: '前端知识大闯关', path: '/frontendGame' },
  { name: '3D粒子特效', path: '/threeDemo' }
]

function navigateTo(path: string) {
  router.push(path)
}

function getParticleStyle(index: number) {
  const left = (index * 5) % 100
  const top = (index * 7) % 100
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 10 + 10
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${index * 0.5}s`
  }
}
</script>

<style scoped lang="scss">
.pages-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-100px) scale(1.5);
    opacity: 0.3;
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 60px 20px;
}

.title {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.title-letter {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.page-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideInLeft 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-50px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateX(10px) scale(1.02);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 60px rgba(102, 126, 234, 0.2);

    &::before {
      opacity: 1;
    }

    .page-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .icon-glow {
      opacity: 1;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .page-arrow {
      transform: translateX(10px);
    }

    .arrow-icon {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.page-icon {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  transition: all 0.4s ease;
  flex-shrink: 0;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  transform: translate(-50%, -50%);
  opacity: 0;
  filter: blur(20px);
  z-index: -1;
  transition: opacity 0.4s ease;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
  }
}

.icon-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-name {
  font-size: 1.375rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.page-path {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Courier New', monospace;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.page-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.4s ease;
  flex-shrink: 0;
}

.arrow-icon {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.4s ease;
  font-weight: 300;
}
</style>

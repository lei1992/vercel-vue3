<template>
  <div class="archive-page">
    <!-- 头部 -->
    <header class="page-header">
      <div class="back-btn" @click="handleBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </div>
      <h1 class="page-title">素材提取</h1>
      <div class="placeholder"></div>
    </header>

    <!-- 主体内容 -->
    <main class="page-content">
      <!-- 输入提取模块 -->
      <section class="extract-section">
        <div class="extract-card">
          <p class="intro-text">
            还在手动截带水印的图、复制不全的文案？<br />
            粘贴笔记/视频链接，一键解析无水印高清资源 +
            完整标题正文，做笔记、剪内容、存素材一步到位！
          </p>

          <div class="input-area">
            <div v-show="!inputValue" class="input-placeholder">
              <svg class="bulb-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm5.5 13l-2.5 2.5-2.5-2.5H12v-2h1.5v2h3v-2H18v2h-.5z"
                />
              </svg>
              <span class="placeholder-text">请粘贴你复制的素材链接</span>
            </div>
            <textarea v-model="inputValue" class="extract-input" rows="3" placeholder=""></textarea>
          </div>

          <div class="action-btns">
            <button class="paste-btn" @click="handlePaste">
              <span>粘贴链接</span>
            </button>
          </div>

          <button class="extract-btn" @click="handleExtract" :disabled="!inputValue">
            开始提取
          </button>
        </div>
      </section>

      <!-- 使用说明模块 -->
      <section class="guide-section">
        <UsageGuide :stepJson="stepData" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UsageGuide from './components/UsageGuide.vue'

const router = useRouter()
const inputValue = ref('')

const handleBack = () => {
  router.back()
}

const handlePaste = async () => {
  try {
    const text = await window.navigator.clipboard.readText()
    inputValue.value = text
  } catch (err) {
    console.error('粘贴失败:', err)
    window.alert('请手动粘贴链接')
  }
}

const handleExtract = () => {
  if (!inputValue.value) return
  console.log('开始提取:', inputValue.value)
  // TODO: 调用提取API
}

const stepData = [
  {
    content: '找到小红书爆款笔记，复制小红书图文链接',
    images: [
      'https://img-nos.yiyouliao.com/alph/73c0cf110d2a14e92f48633db4a833c8.jpeg?yiyouliao_channel=vivo_image'
    ],
    stepNo: 1
  },
  {
    content: '粘贴链接并点击开始分析创作',
    images: [
      'https://img0.baidu.com/it/u=3591665277,2616537962&fm=253&app=138&f=JPEG?w=800&h=1333',
      'https://img1.baidu.com/it/u=4261417784,2894086704&fm=253&app=138&f=JPEG?w=800&h=1336',
      'https://img0.baidu.com/it/u=4072274994,683193218&fm=253&app=138&f=JPEG?w=800&h=1369',
      'https://img0.baidu.com/it/u=1172822830,172144909&fm=253&app=138&f=JPEG?w=800&h=1350',
      'https://img1.baidu.com/it/u=4290283495,20845110&fm=253&app=138&f=JPEG?w=800&h=1338'
    ],
    stepNo: 2
  }
]
</script>

<style scoped lang="scss">
.archive-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
}

// 头部
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  flex-shrink: 0;

  .back-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .placeholder {
    width: 32px;
  }
}

// 主体内容
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 24px;

  &::-webkit-scrollbar {
    display: none;
  }
}

// 输入提取模块
.extract-section {
  margin-bottom: 16px;
}

.extract-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.intro-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 16px;
}

.input-area {
  position: relative;
  margin-bottom: 12px;

  .input-placeholder {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    z-index: 1;

    .bulb-icon {
      width: 16px;
      height: 16px;
      color: #fbbf24;
    }

    .placeholder-text {
      font-size: 14px;
      color: #fbbf24;
    }
  }
}

.extract-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.action-btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.paste-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.extract-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
}

// 使用说明模块
.guide-section {
  flex-shrink: 0;
}
</style>

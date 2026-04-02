<template>
  <div class="usage-guide">
    <!-- 头部 -->
    <div class="guide-header" @click="toggleExpand">
      <span class="title">使用说明</span>
      <div class="toggle-btn">
        <span class="text">{{ isExpanded ? '收起' : '展开' }}</span>
        <svg
          class="arrow-icon"
          :class="{ expanded: isExpanded }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <!-- 内容区域 -->
    <div v-show="isExpanded" class="guide-content">
      <!-- 视频教程 -->
      <div class="video-section">
        <div class="video-preview">
          <img src="https://picsum.photos/200/120" alt="视频教程" class="video-cover" />
          <div class="play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <p class="video-tip">点击视频可以查看素材提取使用说明哦~</p>
      </div>

      <!-- 图文教程 -->
      <div v-if="stepJson.length > 0" class="text-guide">
        <p class="guide-link">也可以查看图文教程~</p>

        <div class="step-list">
          <div v-for="(step, index) in stepJson" :key="index" class="step-group">
            <div class="step-item">
              <div class="step-number">{{ step.stepNo }}</div>
              <p class="step-text">{{ step.content }}</p>
            </div>
            <div v-if="step.images && step.images.length > 0" class="step-images">
              <div v-for="(img, imgIndex) in step.images" :key="imgIndex" class="step-image">
                <img :src="img" :alt="`步骤${step.stepNo}-${imgIndex + 1}`" />
                <span class="step-num">{{ getImageGlobalIndex(index, imgIndex) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface StepItem {
  content: string
  images: string[]
  stepNo: number
}

const props = defineProps({
  stepJson: {
    type: Array as () => StepItem[],
    default: () => []
  }
})

const isExpanded = ref(true)

// 计算图片的全局序号（从1开始累计）
const getImageGlobalIndex = (stepIndex: number, imgIndex: number): number => {
  let count = 0
  for (let i = 0; i < stepIndex; i++) {
    const step = props.stepJson[i]
    if (step?.images) {
      count += step.images.length
    }
  }
  return count + imgIndex + 1
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped lang="scss">
.usage-guide {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;

    .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }
}

.guide-content {
  padding: 0 20px 20px;
}

.video-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .video-preview {
    position: relative;
    width: 120px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    .video-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 14px;
        height: 14px;
        color: #333;
        margin-left: 2px;
      }
    }
  }

  .video-tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }
}

.text-guide {
  .guide-link {
    font-size: 14px;
    color: #fbbf24;
    margin-bottom: 16px;
  }
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .step-number {
    width: 20px;
    height: 20px;
    background: #ef4444;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
  }

  .step-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }
}

.step-images {
  display: flex;
  gap: 8px;
  padding-left: 28px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.step-image {
  position: relative;
  width: 60px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .step-num {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 16px;
    height: 16px;
    background: #fbbf24;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: #333;
  }
}
</style>

<template>
  <div class="tags-page">
    <!-- 导航栏 -->
    <van-nav-bar title="倒计时列表" left-arrow @click-left="$router.back()" />

    <!-- 标签列表 -->
    <div class="tags-list">
      <div
        v-for="item in tagList"
        :key="item.id"
        class="tag-item"
        :class="{ counting: getCountdownState(item.id).isActive }"
      >
        <div class="tag-info">
          <div class="tag-icon">
            <van-icon :name="getIconName(item.id)" size="32" />
          </div>
          <div class="tag-content">
            <div class="tag-name">{{ item.name }}</div>
            <div class="tag-desc">{{ item.description }}</div>
            <div v-if="getCountdownState(item.id).isActive" class="countdown-display">
              <van-icon name="clock-o" />
              剩余时间：{{ formatTime(getCountdownState(item.id).remainingSeconds) }}
            </div>
          </div>
        </div>
        <van-button
          v-if="!getCountdownState(item.id).isActive"
          type="primary"
          size="small"
          @click="handleOpen(item)"
        >
          倒计时
        </van-button>
        <div v-else class="counting-badge">进行中</div>
      </div>
    </div>

    <!-- 倒计时弹窗 -->
    <RemindDialog ref="dialogCompRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import RemindDialog from './RemindDialog.vue'

interface TagItem {
  id: string
  name: string
  description: string
}

interface StorageEvent {
  key: string | null
}

// 子组件 ref
const dialogCompRef = ref()

// 标签列表数据
const tagList = ref<TagItem[]>([
  { id: '1', name: '工作提醒', description: '定时提醒工作事项' },
  { id: '2', name: '休息提醒', description: '定时休息放松' },
  { id: '3', name: '会议提醒', description: '会议前10分钟提醒' },
  { id: '4', name: '喝水提醒', description: '定时喝水保持健康' },
  { id: '5', name: '运动提醒', description: '运动时间提醒' },
  { id: '6', name: '阅读提醒', description: '阅读时间到' }
])

// 倒计时状态存储
const countdownStates = ref<Record<string, { remainingSeconds: number; isActive: boolean }>>({})

// 获取指定 ID 的倒计时状态
const getCountdownState = (id: string) => {
  const storageKey = `remind:${id}`
  const stored = window.localStorage.getItem(storageKey)

  if (stored) {
    const endTimestamp = parseInt(stored, 10)
    if (!isNaN(endTimestamp) && endTimestamp > Date.now()) {
      const remainingSeconds = Math.floor((endTimestamp - Date.now()) / 1000)
      const newState = {
        remainingSeconds,
        isActive: true
      }
      // 只在状态改变时更新
      const currentState = countdownStates.value[id]
      if (
        !currentState ||
        currentState.remainingSeconds !== newState.remainingSeconds ||
        currentState.isActive !== newState.isActive
      ) {
        countdownStates.value[id] = newState
      }
      return newState
    } else {
      window.localStorage.removeItem(storageKey)
    }
  }

  const newState = {
    remainingSeconds: 0,
    isActive: false
  }
  const currentState = countdownStates.value[id]
  if (currentState && currentState.remainingSeconds === 0 && !currentState.isActive) {
    return currentState
  }
  countdownStates.value[id] = newState
  return newState
}

// 更新所有倒计时状态
const updateAllCountdowns = () => {
  tagList.value.forEach((item) => {
    getCountdownState(item.id)
  })
}

// 定时器，每秒更新
let timer: number | null = null

onMounted(() => {
  // 使用 nextTick 避免在初始化时触发递归更新
  nextTick(() => {
    updateAllCountdowns()
    timer = window.setInterval(updateAllCountdowns, 1000)
  })
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 根据ID获取图标名称
const getIconName = (id: string) => {
  const iconMap: Record<string, string> = {
    '1': 'bag-o',
    '2': 'coffee-o',
    '3': 'calender-o',
    '4': 'gem-o',
    '5': 'sport-o',
    '6': 'books-o'
  }
  return iconMap[id] || 'notes-o'
}

// 格式化时间
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 打开弹窗
const handleOpen = (item: TagItem) => {
  dialogCompRef.value?.open(item)
}

// 监听 storage 变化
const handleStorageChange = (e: StorageEvent | null) => {
  if (e && e.key && e.key.startsWith('remind:')) {
    updateAllCountdowns()
  }
}

onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped lang="scss">
.tags-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.tags-list {
  padding: 16px;
}

.tag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &.counting {
    border-color: #ee0a24;
    background: linear-gradient(to right, #fff 0%, #fff5f5 100%);
  }
}

.tag-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin-right: 12px;
}

.tag-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
}

.tag-content {
  flex: 1;
}

.tag-name {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.tag-desc {
  font-size: 14px;
  color: #969799;
  margin-bottom: 4px;
}

.countdown-display {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ee0a24;
  font-size: 14px;
  font-weight: 500;
}

.counting-badge {
  padding: 4px 12px;
  background: #ee0a24;
  color: #fff;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}
</style>

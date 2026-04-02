import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useCooldown(storageKey: string, durationMinutes: number) {
  const remainingSeconds = ref(0)
  const endTimestamp = ref<number | null>(null)
  let timer: number | null = null

  // 停止内部定时器
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 从 localStorage 加载状态
  const loadFromStorage = () => {
    stopTimer()
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const end = parseInt(stored, 10)
      if (!isNaN(end) && end > Date.now()) {
        endTimestamp.value = end
        remainingSeconds.value = Math.floor((end - Date.now()) / 1000)
        startTimer()
        return
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    endTimestamp.value = null
    remainingSeconds.value = 0
  }

  // 启动倒计时定时器
  const startTimer = () => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      if (endTimestamp.value) {
        const remaining = Math.floor((endTimestamp.value - Date.now()) / 1000)
        if (remaining <= 0) {
          localStorage.removeItem(storageKey)
          endTimestamp.value = null
          remainingSeconds.value = 0
          stopTimer()
        } else {
          remainingSeconds.value = remaining
        }
      }
    }, 1000)
  }

  // 开始倒计时
  const startCooldown = () => {
    if (remainingSeconds.value > 0) return
    const end = Date.now() + durationMinutes * 60 * 1000
    localStorage.setItem(storageKey, end.toString())
    endTimestamp.value = end
    remainingSeconds.value = durationMinutes * 60
    startTimer()
  }

  // 监听 storage 变化
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === storageKey) {
      loadFromStorage()
    }
  }

  onMounted(() => {
    loadFromStorage()
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    stopTimer()
    window.removeEventListener('storage', handleStorageChange)
  })

  const isActive = computed(() => remainingSeconds.value > 0)

  return {
    remainingSeconds,
    isActive,
    startCooldown
  }
}

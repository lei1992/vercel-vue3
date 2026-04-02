<template>
  <van-dialog
    v-model:show="show"
    title="倒计时弹窗"
    :show-confirm-button="false"
    close-on-click-overlay
  >
    <div class="dialog-content">
      <van-button type="primary" block @click="handleStartCooldown"> 发起倒计时 </van-button>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCooldown } from '@/composables/useCooldown'

const show = ref(false)
const currentId = ref('')

interface TagItem {
  id: string
  name: string
  description: string
}

// 打开弹窗
const open = (val: TagItem) => {
  currentId.value = val.id
  show.value = true
}

// 处理倒计时开始
const handleStartCooldown = () => {
  const storageKey = `remind:${currentId.value}`
  const { startCooldown } = useCooldown(storageKey, 10)

  // 开始倒计时
  startCooldown()

  // 关闭弹窗
  show.value = false
}

// 暴露方法给父组件
defineExpose({ open })
</script>

<style scoped lang="scss">
.dialog-content {
  padding: 16px;
}
</style>

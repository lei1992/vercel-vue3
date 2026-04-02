import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const sidebarCollapsed = ref(false)

  function toggleDark() {
    isDark.value = !isDark.value
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    isDark,
    sidebarCollapsed,
    toggleDark,
    toggleSidebar
  }
})

export const useArticleStore = defineStore('article', () => {
  const articles = ref<unknown[]>([])

  function setArticles(data: unknown[]) {
    articles.value = data
  }

  return {
    articles,
    setArticles
  }
})

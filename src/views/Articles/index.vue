<template>
  <div class="articles-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <h1 class="page-title">技术文章</h1>
      <p class="page-subtitle">记录前端开发的学习与实践</p>
    </header>

    <!-- 筛选区 -->
    <section class="filter-section">
      <div class="filter-tags">
        <span
          v-for="category in categories"
          :key="category.value"
          class="filter-tag"
          :class="{ active: selectedCategory === category.value }"
          @click="selectedCategory = category.value"
        >
          {{ category.label }}
        </span>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="articles-list">
      <article
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
        @click="viewArticle(article.id)"
      >
        <div class="article-cover">
          <img :src="article.cover" :alt="article.title" />
          <span class="article-category">{{ article.category }}</span>
        </div>
        <div class="article-content">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="article-meta">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              {{ article.date }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ article.views }}
            </span>
            <span class="meta-item">
              <el-icon><ChatLineRound /></el-icon>
              {{ article.comments }}
            </span>
          </div>
        </div>
      </article>
    </section>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <el-button @click="loadMore" :loading="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, View, ChatLineRound } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  excerpt: string
  cover: string
  category: string
  tags: string[]
  date: string
  views: number
  comments: number
}

const router = useRouter()
const selectedCategory = ref('all')
const loading = ref(false)
const hasMore = ref(true)

// 分类
const categories = [
  { label: '全部', value: 'all' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: '性能优化', value: 'performance' },
  { label: '工程化', value: 'engineering' }
]

// 文章数据
const articles = ref<Article[]>([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt:
      '深入理解 Vue 3 的组合式 API，掌握 setup 语法糖、ref/reactive、computed 等核心概念，提升开发效率。',
    cover: 'https://picsum.photos/400/250?random=1',
    category: 'Vue.js',
    tags: ['Vue3', 'Composition API', '入门'],
    date: '2024-02-10',
    views: 1234,
    comments: 45
  },
  {
    id: 2,
    title: 'TypeScript 高级类型实战指南',
    excerpt: '从泛型到条件类型，掌握 TypeScript 的高级类型系统，让你的代码更加健壮和可维护。',
    cover: 'https://picsum.photos/400/250?random=2',
    category: 'TypeScript',
    tags: ['TypeScript', '高级类型', '实战'],
    date: '2024-02-08',
    views: 987,
    comments: 32
  },
  {
    id: 3,
    title: 'React Hooks 最佳实践',
    excerpt: '全面解析 React Hooks 的使用场景和最佳实践，避免常见的性能陷阱，构建高性能组件。',
    cover: 'https://picsum.photos/400/250?random=3',
    category: 'React',
    tags: ['React', 'Hooks', '性能'],
    date: '2024-02-05',
    views: 2156,
    comments: 78
  },
  {
    id: 4,
    title: '前端性能优化全攻略',
    excerpt: '从代码分割、懒加载到缓存策略，全方位提升前端应用性能，打造丝滑的用户体验。',
    cover: 'https://picsum.photos/400/250?random=4',
    category: '性能优化',
    tags: ['性能优化', '用户体验', '实践'],
    date: '2024-02-03',
    views: 3421,
    comments: 125
  },
  {
    id: 5,
    title: 'Vite 构建工具深度解析',
    excerpt: '深入了解 Vite 的构建原理和配置技巧，掌握现代前端工程化工具的使用方法。',
    cover: 'https://picsum.photos/400/250?random=5',
    category: '工程化',
    tags: ['Vite', '工程化', '构建'],
    date: '2024-02-01',
    views: 1876,
    comments: 56
  },
  {
    id: 6,
    title: 'Pinia 状态管理最佳实践',
    excerpt: '从 Vuex 迁移到 Pinia，掌握新一代状态管理方案的最佳实践和设计模式。',
    cover: 'https://picsum.photos/400/250?random=6',
    category: 'Vue.js',
    tags: ['Pinia', '状态管理', 'Vue'],
    date: '2024-01-28',
    views: 1543,
    comments: 67
  }
])

// 筛选后的文章列表
const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') {
    return articles.value
  }
  return articles.value.filter(
    (article) => article.category.toLowerCase() === selectedCategory.value
  )
})

// 查看文章
const viewArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 加载更多
const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    // 模拟加载更多数据
    loading.value = false
    hasMore.value = false
  }, 1000)
}
</script>

<style scoped lang="scss">
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-xl $spacing-lg;
}

// 页面头部
.page-header {
  text-align: center;
  margin-bottom: $spacing-xl;

  .page-title {
    font-size: 36px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .page-subtitle {
    font-size: $font-size-large;
    color: $text-secondary;
  }
}

// 筛选区
.filter-section {
  margin-bottom: $spacing-xl;
}

.filter-tags {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tag {
  padding: $spacing-sm $spacing-lg;
  background: #fff;
  border: 1px solid $border-light;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  color: $text-regular;
  cursor: pointer;
  transition: $transition-all;

  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }

  &.active {
    background: $primary-color;
    border-color: $primary-color;
    color: #fff;
  }
}

// 文章列表
.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.article-card {
  background: #fff;
  border-radius: $border-radius-large;
  overflow: hidden;
  box-shadow: $box-shadow-light;
  cursor: pointer;
  transition: $transition-all;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $box-shadow-base;
  }
}

.article-cover {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .article-category {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    background: rgba(64, 158, 255, 0.9);
    color: #fff;
    font-size: $font-size-small;
    border-radius: $border-radius-small;
  }
}

.article-content {
  padding: $spacing-lg;
}

.article-title {
  font-size: $font-size-large;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  font-size: $font-size-base;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
}

.tag {
  padding: $spacing-xs $spacing-sm;
  background: $bg-page;
  color: $text-secondary;
  font-size: $font-size-small;
  border-radius: $border-radius-small;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $border-lighter;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-small;
  color: $text-secondary;

  .el-icon {
    font-size: 14px;
  }
}

// 加载更多
.load-more {
  text-align: center;
  padding: $spacing-xl 0;
}
</style>

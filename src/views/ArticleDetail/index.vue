<template>
  <div class="article-detail">
    <!-- 返回按钮 -->
    <div class="back-nav">
      <el-button :icon="ArrowLeft" @click="goBack">返回列表</el-button>
    </div>

    <!-- 文章容器 -->
    <div class="article-container">
      <!-- 文章头部 -->
      <header class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="meta-left">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              {{ article.date }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ article.author }}
            </span>
            <span class="meta-item category-tag">{{ article.category }}</span>
          </div>
          <div class="meta-right">
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
        <div class="article-tags">
          <el-tag v-for="tag in article.tags" :key="tag" size="small" type="info">
            {{ tag }}
          </el-tag>
        </div>
      </header>

      <!-- 文章封面 -->
      <div class="article-cover">
        <img :src="article.cover" :alt="article.title" />
      </div>

      <!-- 文章内容 -->
      <article class="article-content">
        <div class="content-wrapper" v-html="article.content"></div>
      </article>

      <!-- 文章底部 -->
      <footer class="article-footer">
        <div class="action-buttons">
          <el-button :icon="Star" type="primary">收藏</el-button>
          <el-button :icon="Share">分享</el-button>
        </div>
        <div class="prev-next">
          <el-button class="nav-btn" :disabled="!prevArticle" @click="goToArticle(prevArticle?.id)">
            <el-icon><ArrowLeft /></el-icon>
            上一篇
          </el-button>
          <el-button class="nav-btn" :disabled="!nextArticle" @click="goToArticle(nextArticle?.id)">
            下一篇
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </footer>

      <!-- 相关文章 -->
      <section class="related-articles">
        <h3 class="section-title">相关推荐</h3>
        <div class="related-grid">
          <div
            v-for="related in relatedArticles"
            :key="related.id"
            class="related-card"
            @click="goToArticle(related.id)"
          >
            <img :src="related.cover" :alt="related.title" />
            <h4>{{ related.title }}</h4>
            <p>{{ related.excerpt }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Calendar,
  User,
  View,
  ChatLineRound,
  ArrowLeft,
  ArrowRight,
  Star,
  Share
} from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  content: string
  cover: string
  author: string
  date: string
  category: string
  tags: string[]
  views: number
  comments: number
  excerpt: string
}

const route = useRoute()
const router = useRouter()

const article = ref<Article>({
  id: 0,
  title: '',
  content: '',
  cover: '',
  author: '',
  date: '',
  category: '',
  tags: [],
  views: 0,
  comments: 0,
  excerpt: ''
})

const prevArticle = ref<Article | null>(null)
const nextArticle = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    content: `
      <h2>简介</h2>
      <p>Vue 3 的 Composition API 是一种新的组织组件逻辑的方式，它提供了更好的代码组织和复用能力。</p>
      
      <h2>setup 语法糖</h2>
      <p>&lt;script setup&gt; 是编译时的语法糖，让使用 Composition API 更加简洁。</p>
      
      <h2>核心概念</h2>
      <h3>1. ref 和 reactive</h3>
      <p>ref 用于基本类型的响应式数据，reactive 用于对象类型的响应式数据。</p>
      <pre><code>const count = ref(0)
const state = reactive({ count: 0 })</code></pre>
      
      <h3>2. computed</h3>
      <p>计算属性，基于响应式数据自动更新。</p>
      
      <h3>3. watch 和 watchEffect</h3>
      <p>侦听器，用于监听数据变化。</p>
      
      <h2>最佳实践</h2>
      <ul>
        <li>优先使用 ref，因为解构和传递更方便</li>
        <li>使用 TypeScript 提升代码质量</li>
        <li>合理使用 computed 和 watch</li>
      </ul>
    `,
    cover: 'https://picsum.photos/800/400?random=1',
    author: '张三',
    date: '2024-02-10',
    category: 'Vue.js',
    tags: ['Vue3', 'Composition API', '入门'],
    views: 1234,
    comments: 45,
    excerpt: '深入理解 Vue 3 的组合式 API，掌握 setup 语法糖、ref/reactive、computed 等核心概念'
  },
  {
    id: 2,
    title: 'TypeScript 高级类型实战指南',
    content: `<h2>简介</h2><p>从泛型到条件类型，掌握 TypeScript 的高级类型系统。</p>`,
    cover: 'https://picsum.photos/800/400?random=2',
    author: '李四',
    date: '2024-02-08',
    category: 'TypeScript',
    tags: ['TypeScript', '高级类型', '实战'],
    views: 987,
    comments: 32,
    excerpt: '从泛型到条件类型，掌握 TypeScript 的高级类型系统'
  },
  {
    id: 3,
    title: 'React Hooks 最佳实践',
    content: `<h2>简介</h2><p>全面解析 React Hooks 的使用场景和最佳实践。</p>`,
    cover: 'https://picsum.photos/800/400?random=3',
    author: '王五',
    date: '2024-02-05',
    category: 'React',
    tags: ['React', 'Hooks', '性能'],
    views: 2156,
    comments: 78,
    excerpt: '全面解析 React Hooks 的使用场景和最佳实践'
  },
  {
    id: 4,
    title: '前端性能优化全攻略',
    content: `<h2>简介</h2><p>从代码分割、懒加载到缓存策略，全方位提升前端应用性能。</p>`,
    cover: 'https://picsum.photos/800/400?random=4',
    author: '赵六',
    date: '2024-02-03',
    category: '性能优化',
    tags: ['性能优化', '用户体验', '实践'],
    views: 3421,
    comments: 125,
    excerpt: '从代码分割、懒加载到缓存策略，全方位提升前端应用性能'
  },
  {
    id: 5,
    title: 'Vite 构建工具深度解析',
    content: `<h2>简介</h2><p>深入了解 Vite 的构建原理和配置技巧。</p>`,
    cover: 'https://picsum.photos/800/400?random=5',
    author: '孙七',
    date: '2024-02-01',
    category: '工程化',
    tags: ['Vite', '工程化', '构建'],
    views: 1876,
    comments: 56,
    excerpt: '深入了解 Vite 的构建原理和配置技巧'
  }
]

// 加载文章数据
const loadArticle = (id: number) => {
  const index = mockArticles.findIndex((a) => a.id === Number(id))
  if (index !== -1) {
    article.value = mockArticles[index]!
    prevArticle.value = index > 0 ? mockArticles[index - 1]! : null
    nextArticle.value = index < mockArticles.length - 1 ? mockArticles[index + 1]! : null
    relatedArticles.value = mockArticles.filter((a) => a.id !== Number(id)).slice(0, 3)
  }
}

// 返回列表
const goBack = () => {
  router.push('/articles')
}

// 跳转到文章
const goToArticle = (id?: number) => {
  if (id) {
    router.push(`/article/${id}`)
    window.scrollTo(0, 0)
  }
}

onMounted(() => {
  loadArticle(Number(route.params.id))
})

// 监听路由参数变化，重新加载文章
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadArticle(Number(newId))
      window.scrollTo(0, 0)
    }
  }
)
</script>

<style scoped lang="scss">
.article-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-xl $spacing-lg;
}

// 返回导航
.back-nav {
  margin-bottom: $spacing-lg;
}

// 文章容器
.article-container {
  background: #fff;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-light;
  overflow: hidden;
}

// 文章头部
.article-header {
  padding: $spacing-xl $spacing-xl $spacing-lg;
  border-bottom: 1px solid $border-lighter;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-lg;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.meta-left,
.meta-right {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-base;
  color: $text-secondary;

  .el-icon {
    font-size: 16px;
  }
}

.category-tag {
  padding: $spacing-xs $spacing-sm;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: $border-radius-small;
  font-size: $font-size-small;
}

.article-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

// 文章封面
.article-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 文章内容
.article-content {
  padding: $spacing-xl;
}

.content-wrapper {
  line-height: 1.8;
  color: $text-regular;

  :deep(h2) {
    font-size: $font-size-extra-large;
    font-weight: 600;
    color: $text-primary;
    margin: $spacing-xl 0 $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid $border-light;
  }

  :deep(h3) {
    font-size: $font-size-large;
    font-weight: 600;
    color: $text-primary;
    margin: $spacing-lg 0 $spacing-sm;
  }

  :deep(p) {
    margin-bottom: $spacing-md;
  }

  :deep(ul) {
    margin-bottom: $spacing-md;
    padding-left: $spacing-xl;

    li {
      margin-bottom: $spacing-xs;
    }
  }

  :deep(pre) {
    background: #f6f8fa;
    padding: $spacing-md;
    border-radius: $border-radius-base;
    overflow-x: auto;
    margin-bottom: $spacing-md;
  }

  :deep(code) {
    font-family: 'Courier New', monospace;
    font-size: $font-size-small;
  }
}

// 文章底部
.article-footer {
  padding: $spacing-xl;
  border-top: 1px solid $border-lighter;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.prev-next {
  display: flex;
  justify-content: space-between;
  gap: $spacing-md;
}

.nav-btn {
  flex: 1;
}

// 相关文章
.related-articles {
  padding: $spacing-xl;
  border-top: 1px solid $border-lighter;
}

.section-title {
  font-size: $font-size-large;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-md;
}

.related-card {
  cursor: pointer;
  transition: $transition-all;

  &:hover {
    transform: translateY(-4px);

    h4 {
      color: $primary-color;
    }
  }

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: $border-radius-base;
    margin-bottom: $spacing-sm;
  }

  h4 {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: $transition-all;
  }

  p {
    font-size: $font-size-small;
    color: $text-secondary;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>

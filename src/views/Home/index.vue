<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="typing-text">{{ currentText }}</span>
          <span class="cursor">|</span>
        </h1>
        <p class="hero-subtitle">记录技术成长，分享生活点滴</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="$router.push('/articles')">
            <el-icon><Document /></el-icon>
            浏览文章
          </el-button>
          <el-button size="large" @click="$router.push('/about')">
            <el-icon><User /></el-icon>
            了解我
          </el-button>
          <el-button size="large" @click="$router.push('/pages')">
            <el-icon><Tickets /></el-icon>
            功能页面
          </el-button>
        </div>
      </div>
      <div class="hero-animation">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-container">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon">
            <el-icon :size="32">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">博客特色</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">
            <el-icon :size="40">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Latest Articles Section -->
    <section class="latest-articles">
      <h2 class="section-title">最新文章</h2>
      <div class="articles-grid">
        <article
          class="article-card"
          v-for="article in articles"
          :key="article.id"
          @click="$router.push(`/article/${article.id}`)"
        >
          <div class="article-cover">
            <img :src="article.cover" :alt="article.title" />
            <span class="article-tag">{{ article.category }}</span>
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span
                ><el-icon><Calendar /></el-icon>{{ article.date }}</span
              >
              <span
                ><el-icon><View /></el-icon>{{ article.views }}</span
              >
            </div>
          </div>
        </article>
      </div>
      <div class="section-action">
        <el-button type="primary" @click="$router.push('/articles')">
          查看更多文章 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </section>

    <!-- Tags Section -->
    <section class="tags">
      <h2 class="section-title">热门标签</h2>
      <div class="tags-cloud">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :type="tag.type"
          :size="tag.size"
          effect="plain"
          class="tag-item"
          @click="$router.push('/tags')"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Document,
  User,
  Edit,
  Collection,
  ChatDotRound,
  Star,
  Calendar,
  View,
  ArrowRight,
  Reading,
  Share,
  Folder,
  DataLine,
  Tickets
} from '@element-plus/icons-vue'

// 打字效果
const currentText = ref('')
const texts = ['欢迎来到我的博客', '探索技术世界', '分享学习心得']
let textIndex = 0
let charIndex = 0
let isDeleting = false
let typingSpeed = 100

const typeText = () => {
  const fullText = texts[textIndex]!
  if (isDeleting) {
    currentText.value = fullText.substring(0, charIndex - 1)
    charIndex--
    typingSpeed = 50
  } else {
    currentText.value = fullText.substring(0, charIndex + 1)
    charIndex++
    typingSpeed = 100
  }

  if (!isDeleting && charIndex === fullText.length) {
    isDeleting = true
    typingSpeed = 2000
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % texts.length
    typingSpeed = 500
  }

  setTimeout(typeText, typingSpeed)
}

// 统计数据
const stats = ref([
  { label: '文章数', value: '12', icon: Document },
  { label: '分类数', value: '5', icon: Folder },
  { label: '标签数', value: '20', icon: Collection },
  { label: '访问量', value: '1.2k', icon: DataLine }
])

// 特色功能
const features = ref([
  {
    title: '技术分享',
    description: '分享前端开发、后端技术等专业技术文章',
    icon: Edit
  },
  {
    title: '生活点滴',
    description: '记录生活中的有趣瞬间和感悟',
    icon: ChatDotRound
  },
  {
    title: '精选收藏',
    description: '整理收藏的优质资源和工具',
    icon: Star
  },
  {
    title: '深度阅读',
    description: '提供有深度的技术分析和思考',
    icon: Reading
  },
  {
    title: '互动交流',
    description: '留言互动，与志同道合的朋友交流',
    icon: Share
  },
  {
    title: '持续更新',
    description: '保持活跃更新，分享最新内容',
    icon: Collection
  }
])

// 最新文章（模拟数据）
const articles = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 详解',
    excerpt: '深入理解 Vue3 组合式 API 的使用方法和最佳实践',
    cover: 'https://picsum.photos/400/250?random=1',
    category: '前端',
    date: '2024-02-10',
    views: 1234
  },
  {
    id: 2,
    title: 'TypeScript 进阶指南',
    excerpt: '掌握 TypeScript 高级特性，提升代码质量',
    cover: 'https://picsum.photos/400/250?random=2',
    category: '前端',
    date: '2024-02-08',
    views: 987
  },
  {
    id: 3,
    title: 'Vite 构建工具深度解析',
    excerpt: '了解 Vite 的工作原理和优化技巧',
    cover: 'https://picsum.photos/400/250?random=3',
    category: '工具',
    date: '2024-02-05',
    views: 765
  }
])

// 热门标签
const tags = ref([
  { name: 'Vue3', type: 'primary', size: 'large' },
  { name: 'TypeScript', type: 'success', size: 'large' },
  { name: 'Vite', type: 'warning', size: '' },
  { name: 'Pinia', type: 'info', size: '' },
  { name: 'Element Plus', type: 'danger', size: '' },
  { name: '前端', type: 'primary', size: '' },
  { name: 'JavaScript', type: 'success', size: '' },
  { name: 'CSS', type: 'warning', size: 'small' },
  { name: 'SCSS', type: 'info', size: 'small' },
  { name: '性能优化', type: 'danger', size: 'small' }
])

onMounted(() => {
  typeText()
})
</script>

<style scoped lang="scss">
.home {
  width: 100%;
}

/* Hero Section */
.hero {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &-content {
    text-align: center;
    color: white;
    z-index: 2;
    padding: $spacing-xl;
  }

  &-title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: $spacing-md;
    height: 70px;
    display: flex;
    align-items: center;

    .typing-text {
      display: inline;
    }

    .cursor {
      animation: blink 1s infinite;
      height: 70px;
    }
  }

  &-subtitle {
    font-size: 20px;
    opacity: 0.9;
    margin-bottom: $spacing-xl;
  }

  &-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;
  }

  &-animation {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .floating-shapes {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;

    &-1 {
      width: 200px;
      height: 200px;
      background: white;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    &-2 {
      width: 150px;
      height: 150px;
      background: white;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    &-3 {
      width: 100px;
      height: 100px;
      background: white;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Stats Section */
.stats {
  padding: $spacing-xl 0;
  background: $bg-page;

  &-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-lg;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: white;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    transition: $transition-all;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $box-shadow-dark;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-content {
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: $primary-color;
        margin-bottom: $spacing-xs;
      }

      .stat-label {
        font-size: 14px;
        color: $text-secondary;
      }
    }
  }
}

/* Features Section */
.features {
  padding: $spacing-xl 0;

  .section-title {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: $spacing-xl;
    color: $text-primary;
  }

  &-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-lg;
  }

  .feature-card {
    padding: $spacing-lg;
    background: white;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    transition: $transition-all;
    text-align: center;

    &:hover {
      transform: translateY(-8px);
      box-shadow: $box-shadow-dark;
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto $spacing-md;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .feature-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: $spacing-sm;
      color: $text-primary;
    }

    .feature-desc {
      font-size: 14px;
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

/* Latest Articles Section */
.latest-articles {
  padding: $spacing-xl 0;
  background: $bg-page;

  .section-title {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: $spacing-xl;
    color: $text-primary;
  }

  .articles-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-lg;
  }

  .article-card {
    background: white;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
    overflow: hidden;
    cursor: pointer;
    transition: $transition-all;

    &:hover {
      transform: translateY(-8px);
      box-shadow: $box-shadow-dark;
    }

    .article-cover {
      position: relative;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .article-tag {
        position: absolute;
        top: $spacing-sm;
        left: $spacing-sm;
        padding: 4px 12px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    .article-content {
      padding: $spacing-lg;

      .article-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: $spacing-sm;
        color: $text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .article-desc {
        font-size: 14px;
        color: $text-secondary;
        line-height: 1.6;
        margin-bottom: $spacing-md;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .article-meta {
        display: flex;
        gap: $spacing-md;
        font-size: 12px;
        color: $text-secondary;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .section-action {
    text-align: center;
    margin-top: $spacing-xl;
  }
}

/* Tags Section */
.tags {
  padding: $spacing-xl 0;

  .section-title {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: $spacing-xl;
    color: $text-primary;
  }

  .tags-cloud {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    justify-content: center;
    padding: 0 $spacing-lg;

    .tag-item {
      cursor: pointer;
      transition: $transition-all;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    &-title {
      font-size: 32px;
    }

    &-subtitle {
      font-size: 16px;
    }

    .shape {
      display: none;
    }
  }

  .stats-container,
  .features-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

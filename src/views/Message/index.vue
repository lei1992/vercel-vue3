<template>
  <div class="message-page">
    <!-- 3D翻书容器 -->
    <div class="flipbook-viewport">
      <div class="flipbook-container">
        <div
          class="flipbook"
          :class="{ 'is-open': currentSheet > 0 && currentSheet < totalSheets }"
        >
          <!-- 页面列表 -->
          <div
            v-for="(sheet, index) in sheets"
            :key="sheet.id"
            class="sheet"
            :class="{
              'is-flipped': index < currentSheet,
              'is-active': index === currentSheet,
              'is-cover': index === 0,
              'is-back-cover': index === totalSheets - 1
            }"
            :style="getSheetStyle(index)"
            @click="handleSheetClick(index)"
          >
            <!-- 正面 -->
            <div class="page page-front">
              <div class="page-content">
                <component :is="sheet.front" />
              </div>
            </div>
            <!-- 背面 -->
            <div class="page page-back">
              <div class="page-content">
                <component :is="sheet.back" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航控制 -->
    <div class="flipbook-controls">
      <van-button
        class="nav-btn"
        icon="arrow-left"
        :disabled="currentSheet <= 0"
        @click="prevSheet"
      >
        上一页
      </van-button>

      <div class="page-info">
        <div class="page-indicator">
          {{ getPageLabel() }}
        </div>
        <div class="page-progress">
          <div
            class="progress-bar"
            :style="{ width: (currentSheet / (totalSheets - 1)) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <van-button
        class="nav-btn"
        icon="arrow"
        icon-position="right"
        :disabled="currentSheet >= totalSheets - 1"
        @click="nextSheet"
      >
        下一页
      </van-button>
    </div>

    <!-- 快速跳转 -->
    <div class="quick-nav">
      <span
        v-for="(_, index) in sheets"
        :key="index"
        class="dot"
        :class="{ active: index === currentSheet }"
        @click="goToSheet(index)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'

interface InputEvent {
  target: {
    value: string
  }
}

// 当前页码(从0开始,0=封面,last=封底)
const currentSheet = ref(0)

// 表单数据
const form = ref({
  author: '',
  content: ''
})

// 留言数据
const messages = ref([
  { id: '1', author: '张三', content: '这个留言板功能很实用,界面也很美观!', time: '2024-01-15' },
  {
    id: '2',
    author: '李四',
    content: '希望能够添加图片上传功能,这样会更方便。',
    time: '2024-01-14'
  },
  { id: '3', author: '王五', content: '翻书效果很棒,很有真实感!', time: '2024-01-13' }
])

const hotMessages = ref([
  {
    id: '4',
    author: '赵六',
    content: '这个项目做得很好,期待更多功能的更新。',
    time: '2024-01-12',
    likes: 128
  },
  {
    id: '5',
    author: '孙七',
    content: '建议增加夜间模式,这样晚上查看会更舒服。',
    time: '2024-01-11',
    likes: 96
  },
  {
    id: '6',
    author: '周八',
    content: '希望能支持留言回复功能,方便互动交流。',
    time: '2024-01-10',
    likes: 84
  }
])

// ============ 页面组件 ============

// 封面
const CoverPage = () =>
  h('div', { class: 'cover-design' }, [
    h('div', { class: 'cover-pattern' }),
    h('van-icon', { name: 'chat-o', size: '72', class: 'cover-icon' }),
    h('h1', { class: 'cover-title' }, '留言板'),
    h('p', { class: 'cover-subtitle' }, '留下你的想法与建议'),
    h('div', { class: 'cover-divider' }, [
      h('span', { class: 'line' }),
      h('van-icon', { name: 'bookmark-o', size: '16' }),
      h('span', { class: 'line' })
    ]),
    h(
      'p',
      { class: 'cover-date' },
      new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    ),
    h('p', { class: 'cover-hint' }, '点击下一页开始阅读')
  ])

// 第1页 - 最新留言
const Page1 = () =>
  h('div', { class: 'sheet-content' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '01'),
      h('h2', { class: 'sheet-title' }, '最新留言')
    ]),
    h(
      'div',
      { class: 'messages-container' },
      messages.value.map((msg) =>
        h('div', { class: 'msg-item', key: msg.id }, [
          h('div', { class: 'msg-avatar' }, [h('van-icon', { name: 'user-circle-o', size: '32' })]),
          h('div', { class: 'msg-body' }, [
            h('div', { class: 'msg-meta' }, [
              h('span', { class: 'msg-author' }, msg.author),
              h('span', { class: 'msg-time' }, msg.time)
            ]),
            h('p', { class: 'msg-text' }, msg.content)
          ])
        ])
      )
    )
  ])

// 第2页 - 添加留言
const Page2 = () =>
  h('div', { class: 'sheet-content' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '02'),
      h('h2', { class: 'sheet-title' }, '添加留言')
    ]),
    h('div', { class: 'form-container' }, [
      h('div', { class: 'form-group' }, [
        h('label', { class: 'form-label' }, '您的昵称'),
        h('input', {
          class: 'form-input',
          type: 'text',
          placeholder: '请输入昵称',
          value: form.value.author,
          onInput: (e: InputEvent) => {
            form.value.author = e.target.value
          }
        })
      ]),
      h('div', { class: 'form-group' }, [
        h('label', { class: 'form-label' }, '留言内容'),
        h('textarea', {
          class: 'form-textarea',
          placeholder: '写下您的想法...',
          rows: 4,
          value: form.value.content,
          onInput: (e: InputEvent) => {
            form.value.content = e.target.value
          }
        })
      ]),
      h('button', { class: 'submit-btn', onClick: submitMessage }, [
        h('van-icon', { name: 'edit-o', size: '16' }),
        ' 提交留言'
      ])
    ])
  ])

// 第3页 - 热门留言
const Page3 = () =>
  h('div', { class: 'sheet-content' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '03'),
      h('h2', { class: 'sheet-title' }, '热门留言')
    ]),
    h(
      'div',
      { class: 'messages-container hot' },
      hotMessages.value.map((msg) =>
        h('div', { class: 'msg-item hot', key: msg.id }, [
          h('div', { class: 'msg-rank' }, [
            h('van-icon', { name: 'fire-o', color: '#ff6b6b', size: '20' })
          ]),
          h('div', { class: 'msg-body' }, [
            h('div', { class: 'msg-meta' }, [
              h('span', { class: 'msg-author' }, msg.author),
              h('span', { class: 'msg-likes' }, [
                h('van-icon', { name: 'good-job-o', size: '14' }),
                ` ${msg.likes}`
              ])
            ]),
            h('p', { class: 'msg-text' }, msg.content)
          ])
        ])
      )
    )
  ])

// 第4页 - 关于
const Page4 = () =>
  h('div', { class: 'sheet-content about' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '04'),
      h('h2', { class: 'sheet-title' }, '关于我们')
    ]),
    h('div', { class: 'about-content' }, [
      h('div', { class: 'about-icon' }, [
        h('van-icon', { name: 'info-o', size: '48', color: '#667eea' })
      ]),
      h('p', { class: 'about-text' }, '感谢您使用我们的留言板功能！'),
      h('p', { class: 'about-text' }, '我们致力于打造一个友好、开放的交流平台。'),
      h('p', { class: 'about-text' }, '每一条留言我们都会认真阅读，您的建议是我们进步的动力。'),
      h('div', { class: 'about-stats' }, [
        h('div', { class: 'stat-item' }, [
          h('span', { class: 'stat-num' }, '1000+'),
          h('span', { class: 'stat-label' }, '留言')
        ]),
        h('div', { class: 'stat-item' }, [
          h('span', { class: 'stat-num' }, '500+'),
          h('span', { class: 'stat-label' }, '用户')
        ]),
        h('div', { class: 'stat-item' }, [
          h('span', { class: 'stat-num' }, '99%'),
          h('span', { class: 'stat-label' }, '满意度')
        ])
      ])
    ])
  ])

// 第5页 - 用户排行榜
const Page5 = () =>
  h('div', { class: 'sheet-content' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '05'),
      h('h2', { class: 'sheet-title' }, '活跃用户')
    ]),
    h('div', { class: 'rank-list' }, [
      h('div', { class: 'rank-item top1' }, [
        h('div', { class: 'rank-badge' }, '1'),
        h('div', { class: 'rank-info' }, [
          h('span', { class: 'rank-name' }, '张三'),
          h('span', { class: 'rank-count' }, '128条留言')
        ]),
        h('van-icon', { name: 'medal-o', size: '24', color: '#FFD700' })
      ]),
      h('div', { class: 'rank-item top2' }, [
        h('div', { class: 'rank-badge' }, '2'),
        h('div', { class: 'rank-info' }, [
          h('span', { class: 'rank-name' }, '李四'),
          h('span', { class: 'rank-count' }, '96条留言')
        ]),
        h('van-icon', { name: 'medal-o', size: '24', color: '#C0C0C0' })
      ]),
      h('div', { class: 'rank-item top3' }, [
        h('div', { class: 'rank-badge' }, '3'),
        h('div', { class: 'rank-info' }, [
          h('span', { class: 'rank-name' }, '王五'),
          h('span', { class: 'rank-count' }, '84条留言')
        ]),
        h('van-icon', { name: 'medal-o', size: '24', color: '#CD7F32' })
      ]),
      h('div', { class: 'rank-item' }, [
        h('div', { class: 'rank-badge' }, '4'),
        h('div', { class: 'rank-info' }, [
          h('span', { class: 'rank-name' }, '赵六'),
          h('span', { class: 'rank-count' }, '72条留言')
        ])
      ]),
      h('div', { class: 'rank-item' }, [
        h('div', { class: 'rank-badge' }, '5'),
        h('div', { class: 'rank-info' }, [
          h('span', { class: 'rank-name' }, '孙七'),
          h('span', { class: 'rank-count' }, '65条留言')
        ])
      ])
    ])
  ])

// 第6页 - 留言统计
const Page6 = () =>
  h('div', { class: 'sheet-content stats' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '06'),
      h('h2', { class: 'sheet-title' }, '数据统计')
    ]),
    h('div', { class: 'stats-grid' }, [
      h('div', { class: 'stat-card' }, [
        h('div', { class: 'stat-icon blue' }, [h('van-icon', { name: 'chat-o', size: '32' })]),
        h('div', { class: 'stat-value' }, '1,234'),
        h('div', { class: 'stat-label' }, '总留言数')
      ]),
      h('div', { class: 'stat-card' }, [
        h('div', { class: 'stat-icon green' }, [h('van-icon', { name: 'user-o', size: '32' })]),
        h('div', { class: 'stat-value' }, '567'),
        h('div', { class: 'stat-label' }, '注册用户')
      ]),
      h('div', { class: 'stat-card' }, [
        h('div', { class: 'stat-icon orange' }, [h('van-icon', { name: 'eye-o', size: '32' })]),
        h('div', { class: 'stat-value' }, '8.9k'),
        h('div', { class: 'stat-label' }, '浏览量')
      ]),
      h('div', { class: 'stat-card' }, [
        h('div', { class: 'stat-icon purple' }, [
          h('van-icon', { name: 'good-job-o', size: '32' })
        ]),
        h('div', { class: 'stat-value' }, '3.2k'),
        h('div', { class: 'stat-label' }, '点赞数')
      ])
    ]),
    h('div', { class: 'chart-placeholder' }, [
      h('p', '月度留言趋势'),
      h('div', { class: 'trend-bars' }, [
        h('div', { class: 'bar', style: 'height: 40%' }),
        h('div', { class: 'bar', style: 'height: 60%' }),
        h('div', { class: 'bar', style: 'height: 45%' }),
        h('div', { class: 'bar', style: 'height: 80%' }),
        h('div', { class: 'bar', style: 'height: 70%' }),
        h('div', { class: 'bar active', style: 'height: 95%' })
      ])
    ])
  ])

// 第7页 - 精选回复
const Page7 = () =>
  h('div', { class: 'sheet-content' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '07'),
      h('h2', { class: 'sheet-title' }, '精选回复')
    ]),
    h('div', { class: 'reply-list' }, [
      h('div', { class: 'reply-card' }, [
        h('div', { class: 'reply-quote' }, [
          h('van-icon', { name: 'quote', size: '16', color: '#667eea' }),
          h('p', { class: 'reply-text' }, '非常感谢大家的支持和建议，我们会持续改进产品功能！')
        ]),
        h('div', { class: 'reply-author' }, [
          h('van-icon', { name: 'manager-o', size: '16' }),
          h('span', '官方回复'),
          h('span', { class: 'reply-time' }, '2024-01-15')
        ])
      ]),
      h('div', { class: 'reply-card' }, [
        h('div', { class: 'reply-quote' }, [
          h('van-icon', { name: 'quote', size: '16', color: '#667eea' }),
          h('p', { class: 'reply-text' }, '夜间模式已经在开发计划中，预计下个月上线。')
        ]),
        h('div', { class: 'reply-author' }, [
          h('van-icon', { name: 'manager-o', size: '16' }),
          h('span', '官方回复'),
          h('span', { class: 'reply-time' }, '2024-01-14')
        ])
      ]),
      h('div', { class: 'reply-card' }, [
        h('div', { class: 'reply-quote' }, [
          h('van-icon', { name: 'quote', size: '16', color: '#667eea' }),
          h('p', { class: 'reply-text' }, '图片上传功能正在测试中，敬请期待！')
        ]),
        h('div', { class: 'reply-author' }, [
          h('van-icon', { name: 'manager-o', size: '16' }),
          h('span', '官方回复'),
          h('span', { class: 'reply-time' }, '2024-01-13')
        ])
      ])
    ])
  ])

// 第8页 - 使用指南
const Page8 = () =>
  h('div', { class: 'sheet-content guide' }, [
    h('div', { class: 'sheet-header' }, [
      h('span', { class: 'page-number' }, '08'),
      h('h2', { class: 'sheet-title' }, '使用指南')
    ]),
    h('div', { class: 'guide-list' }, [
      h('div', { class: 'guide-item' }, [
        h('div', { class: 'guide-step' }, '1'),
        h('div', { class: 'guide-content' }, [
          h('h4', '如何留言'),
          h('p', '点击"添加留言"页面，填写昵称和内容后提交即可。')
        ])
      ]),
      h('div', { class: 'guide-item' }, [
        h('div', { class: 'guide-step' }, '2'),
        h('div', { class: 'guide-content' }, [
          h('h4', '查看热门'),
          h('p', '在"热门留言"页面可以看到点赞最多的留言。')
        ])
      ]),
      h('div', { class: 'guide-item' }, [
        h('div', { class: 'guide-step' }, '3'),
        h('div', { class: 'guide-content' }, [
          h('h4', '翻页操作'),
          h('p', '点击页面或使用下方按钮进行翻页浏览。')
        ])
      ]),
      h('div', { class: 'guide-item' }, [
        h('div', { class: 'guide-step' }, '4'),
        h('div', { class: 'guide-content' }, [
          h('h4', '快速跳转'),
          h('p', '点击底部圆点可快速跳转到指定页面。')
        ])
      ])
    ])
  ])

// 封底
const BackCoverPage = () =>
  h('div', { class: 'cover-design back' }, [
    h('div', { class: 'cover-pattern' }),
    h('van-icon', { name: 'envelopes-o', size: '72', class: 'cover-icon' }),
    h('h1', { class: 'cover-title' }, '感谢阅读'),
    h('p', { class: 'cover-subtitle' }, '期待您的留言与建议'),
    h('div', { class: 'cover-divider' }, [
      h('span', { class: 'line' }),
      h('van-icon', { name: 'bookmark', size: '16' }),
      h('span', { class: 'line' })
    ]),
    h('p', { class: 'cover-end' }, 'THE END'),
    h('p', { class: 'cover-hint' }, '点击上一页返回')
  ])

// ============ 页面配置 ============
const sheets = [
  { id: 'cover', front: CoverPage, back: Page1 },
  { id: 'page2', front: Page2, back: Page3 },
  { id: 'page3', front: Page4, back: Page5 },
  { id: 'page4', front: Page6, back: Page7 },
  { id: 'page5', front: Page8, back: BackCoverPage }
]

const totalSheets = sheets.length

// ============ 方法 ============
const getSheetStyle = (index: number) => {
  const isFlipped = index < currentSheet.value
  const zIndex = isFlipped ? index : totalSheets - index

  return {
    zIndex,
    transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)'
  }
}

const getPageLabel = () => {
  if (currentSheet.value === 0) return '封面'
  if (currentSheet.value === totalSheets - 1) return '封底'
  return `${currentSheet.value} / ${totalSheets - 2}`
}

const nextSheet = () => {
  if (currentSheet.value < totalSheets - 1) {
    currentSheet.value++
  }
}

const prevSheet = () => {
  if (currentSheet.value > 0) {
    currentSheet.value--
  }
}

const goToSheet = (index: number) => {
  currentSheet.value = index
}

const handleSheetClick = (index: number) => {
  if (index === currentSheet.value) {
    nextSheet()
  } else if (index === currentSheet.value - 1) {
    prevSheet()
  }
}

const submitMessage = () => {
  if (!form.value.author || !form.value.content) {
    window.alert('请填写昵称和留言内容')
    return
  }
  messages.value.unshift({
    id: Date.now().toString(),
    author: form.value.author,
    content: form.value.content,
    time: new Date().toLocaleDateString('zh-CN')
  })
  form.value.author = ''
  form.value.content = ''
  window.alert('留言提交成功!')
}
</script>

<style scoped lang="scss">
.message-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 3D视口
.flipbook-viewport {
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 1.5;
  perspective: 2000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flipbook-container {
  width: 80%;
  height: 90%;
  position: relative;
}

// 翻书主体
.flipbook {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;

  // 书本合上状态
  &:not(.is-open) {
    transform: rotateY(-5deg);
  }
}

// 单页
.sheet {
  position: absolute;
  width: 50%;
  height: 100%;
  right: 0;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;

  &:hover:not(.is-flipped) {
    .page-front::after {
      opacity: 0.1;
    }
  }
}

// 页面
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  &-front {
    background: linear-gradient(to right, #f0f0f0 0%, #fff 5%, #fff 100%);
    border-radius: 4px 12px 12px 4px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 30px;
      background: linear-gradient(to left, rgba(0, 0, 0, 0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  &-back {
    background: linear-gradient(to left, #f0f0f0 0%, #fff 5%, #fff 100%);
    border-radius: 12px 4px 4px 12px;
    transform: rotateY(180deg);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 30px;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, transparent 100%);
    }
  }
}

.page-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

// 封面设计
.cover-design {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 40px;
  text-align: center;
  position: relative;

  &.back {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
}

.cover-icon {
  margin-bottom: 24px;
  animation: pulse 2s ease-in-out infinite;
}

.cover-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
}

.cover-subtitle {
  font-size: 18px;
  margin: 0 0 24px;
  opacity: 0.9;
}

.cover-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;

  .line {
    width: 60px;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
  }
}

.cover-date {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.cover-end {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 8px;
  margin: 16px 0;
  opacity: 0.9;
}

.cover-hint {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 40px;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

// 内页内容
.sheet-content {
  padding: 30px;
  height: 100%;
  box-sizing: border-box;

  &.about {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
}

.sheet-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

.page-number {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  opacity: 0.3;
  line-height: 1;
}

.sheet-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

// 留言列表
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.msg-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.hot {
    border-left-color: #ff6b6b;
    background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  }
}

.msg-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.msg-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.msg-author {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.msg-time {
  font-size: 11px;
  color: #999;
  margin-left: auto;
}

.msg-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff6b6b;
  margin-left: auto;
}

.msg-text {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

// 表单
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
}

// 关于页面
.about-content {
  text-align: center;
  padding: 20px 0;
}

.about-icon {
  margin-bottom: 20px;
}

.about-text {
  color: #666;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 12px;
}

// 排行榜
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.top1 {
    background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
    border: 1px solid #ffd700;
  }

  &.top2 {
    background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
    border: 1px solid #c0c0c0;
  }

  &.top3 {
    background: linear-gradient(135deg, #fff5eb 0%, #fff 100%);
    border: 1px solid #cd7f32;
  }
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rank-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.rank-count {
  font-size: 12px;
  color: #999;
}

// 统计页面
.sheet-content.stats {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: #fff;

  &.blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.green {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  &.orange {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.purple {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.chart-placeholder {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  text-align: center;

  p {
    font-size: 12px;
    color: #999;
    margin: 0 0 12px;
  }
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  height: 80px;

  .bar {
    width: 24px;
    background: linear-gradient(to top, #667eea 0%, #764ba2 100%);
    border-radius: 4px 4px 0 0;
    opacity: 0.6;
    transition: all 0.3s;

    &.active {
      opacity: 1;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
  }
}

// 精选回复
.reply-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.reply-quote {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  .reply-text {
    margin: 0;
    color: #333;
    font-size: 13px;
    line-height: 1.6;
    font-style: italic;
  }
}

.reply-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #667eea;

  .reply-time {
    margin-left: auto;
    color: #999;
  }
}

// 使用指南
.sheet-content.guide {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.guide-step {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.guide-content {
  flex: 1;

  h4 {
    margin: 0 0 6px;
    font-size: 14px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }
}

.about-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

// 控制栏
.flipbook-controls {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 30px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-btn {
  min-width: 100px;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.page-indicator {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.page-progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

// 快速导航
.quick-nav {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: #667eea;
    transform: scale(1.2);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
}

// 响应式
@media (max-width: 768px) {
  .flipbook-viewport {
    aspect-ratio: 1.2;
  }

  .flipbook-container {
    width: 95%;
    height: 85%;
  }

  .cover-title {
    font-size: 32px;
  }

  .sheet-content {
    padding: 20px;
  }

  .page-number {
    font-size: 24px;
  }

  .sheet-title {
    font-size: 18px;
  }

  .flipbook-controls {
    padding: 12px 20px;
    gap: 16px;
  }

  .nav-btn {
    min-width: 80px;
  }
}
</style>

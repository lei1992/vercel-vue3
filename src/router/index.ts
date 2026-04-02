import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/pages',
    name: 'PagesList',
    component: () => import('@/views/pages.vue')
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/Articles/index.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail/index.vue')
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('@/views/Tags/index.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/Categories/index.vue')
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/Archive/index.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About/index.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/Message/index.vue')
  },
  {
    path: '/threeDemo',
    name: 'ThreeDemo',
    component: () => import('@/views/ThreeDemo/index.vue')
  },
  {
    path: '/frontendGame',
    name: 'FrontendGame',
    component: () => import('@/views/FrontendGame/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

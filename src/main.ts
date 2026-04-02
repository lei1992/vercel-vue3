import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupVant } from './plugins/vant'
import router from './router'
import './styles/global.scss'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, markRaw(component))
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
setupVant(app)

app.mount('#app')

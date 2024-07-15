import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 暗黑模式切换的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import gloablComponent from './components/index'
import '@/styles/index.scss'
import router from '@/router/index'
import './permission'
import paina from "./stores/index"

const app = createApp(App)

app.use(ElementPlus, { locale: zhCn})
app.use(paina)
app.use(router)
app.use(gloablComponent)
app.mount('#app')

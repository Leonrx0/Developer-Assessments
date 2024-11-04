import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import '@/assets/iconfont/icon/iconfont.css'
import 'element-plus/dist/index.css'


createApp(App).use(ElementPlus).use(router).mount('#app')
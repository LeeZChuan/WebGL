import '@/assets/main.scss'
import '@/assets/theme.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/utils/lightgl/lightgl.js'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

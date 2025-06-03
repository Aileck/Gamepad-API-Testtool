import './assets/main.css'

import { createApp } from 'vue'
import Index from './Index.vue'
import i18n from './scripts/i18n'

const app = createApp(Index)

app.use(i18n)
app.mount('#app')


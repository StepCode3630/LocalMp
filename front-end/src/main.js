import './assets/main.css'

// Initialize dark mode from localStorage or system preference
const savedDarkMode = localStorage.getItem('darkMode')
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches

if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
  document.documentElement.classList.add('dark')
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

declare global {
  interface Window {
    fileData: ArrayBuffer;
  }
}

createApp(App).mount('#app')

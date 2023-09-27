import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import messages from './utils/i18nMessages'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'
import { vLoading } from 'element-plus'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: 'en-US',
  messages: messages
})

declare global {
  interface Window {
    fileData: ArrayBuffer;
  }
}

createApp(App).directive('loading', vLoading).use(i18n).mount('#app')

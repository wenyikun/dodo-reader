import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Chat from './Chat.vue'
import { createI18n } from 'vue-i18n'
import messages from './utils/i18nMessages'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'
import { vLoading } from 'element-plus'

const i18n = createI18n({
  legacy: false,
  locale: window.language,
  fallbackLocale: 'en',
  messages: messages,
})

declare global {
  interface Window {
    pageName: 'epub_reader' | 'chat'
    language: string
    fileData: ArrayBuffer
  }
}

createApp(window.pageName === 'chat' ? Chat : App)
  .directive('loading', vLoading)
  .use(i18n)
  .mount('#app')

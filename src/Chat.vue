<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { configPromise } from './utils'
import webviewMessages from './utils/webviewMessages'

const { t } = useI18n()
const content = ref('')
const messages = ref<Array<{ role: string; content: string }>>([])
const loading = ref(false)

const sendMessage = async () => {
  if (!content.value.trim() || loading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: content.value,
  })

  const userMessage = content.value
  content.value = ''
  loading.value = true

  // 添加一个空的助手消息，用于流式显示
  messages.value.push({
    role: 'assistant',
    content: '',
  })

  try {
    const config = await configPromise
    const response = await webviewMessages.fetch({
      url: config.chatApi,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + config.chatApiKey,
      },
      data: {
        stream: true,
        model: config.chatModel,
        messages: [
          {
            role: 'system',
            content: '你是一个有用的助手。',
          },
          ...messages.value.slice(0, -1), // 不包括最后一个空的助手消息
        ],
      },
      responseType: 'stream',
    })

    const reader = response.getReader()
    let assistantResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const datas = value.split('\n\n')
      datas.forEach((list: string) => {
        const data = list.replace('data: ', '')
        if (data.startsWith('{')) {
          try {
            const json = JSON.parse(data)
            const content = json.choices[0].delta?.content || ''
            assistantResponse += content
            // 更新最后一条消息的内容
            messages.value[messages.value.length - 1].content = assistantResponse
          } catch (e) {
            // 解析错误，忽略
          }
        }
      })
    }
  } catch (error) {
    ElMessage.error(t('chatError') || 'Error occurred during chat.')
    // 移除空的助手消息
    messages.value.pop()
  } finally {
    loading.value = false
  }
}

const clearChat = () => {
  messages.value = []
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-if="messages.length === 0" class="empty-chat">
        <p>{{ t('startChatting') || 'Start chatting with AI...' }}</p>
      </div>

      <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.role">
        <div class="message-avatar">
          <el-avatar :size="36" :icon="msg.role === 'user' ? 'User' : 'Assistant'">
            {{ msg.role === 'user' ? 'U' : 'A' }}
          </el-avatar>
        </div>
        <div class="message-content">
          <p v-if="msg.content">{{ msg.content }}</p>
          <p v-else-if="msg.role === 'assistant'" class="typing">{{ t('typing') || 'Typing...' }}</p>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        :placeholder="t('typeMessage') || 'Type message...'"
        @keyup.enter="sendMessage"
        input-style="background-color: transparent;"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chat-header h2 {
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 16px;
}

.empty-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--el-text-color-secondary);
}

.message {
  display: flex;
  margin-bottom: 16px;
}

.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.message-content {
  padding: 10px;
  border-radius: 4px;
  max-width: 80%;
}

.message.user .message-content {
  background-color: var(--el-color-primary-light-9);
}

.message.assistant .message-content {
  background-color: var(--el-fill-color-light);
}

.typing {
  color: var(--el-text-color-secondary);
  font-style: italic;
}

.chat-input {
  margin-top: auto;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.hint {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>

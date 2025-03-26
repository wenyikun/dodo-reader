<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ePub from 'epubjs'
import EpubToc from './components/EpubToc.vue'
import { Expand, Fold, ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { DO_COPY, DO_TRANSLATE, GET_CONTENT } from './utils/messageTypes'
import webviewMessages from './utils/webviewMessages'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { configPromise } from './utils'
import messages, { langs } from './utils/i18nMessages'

const container = ref()
const viewer = ref()
const toc = ref([])
const tocShow = ref(false)
const currentLoc = ref('') // Current location within the ebook
const prevArrowShow = ref(false)
const nextArrowShow = ref(false)
const epubToc = ref()
let book: any = null // Variable to hold the eBook object
let rendition: any = null // Variable to hold the eBook rendition
let currentDoc: any = null
const menusLeft = ref(0)
const menusTop = ref(0)
const showMenus = ref(false)
const selectionContent = ref('')
const draging = ref(false)
const sideWidth = ref(240)
const { t } = useI18n()
const translationVisible = ref(false)
const loading = ref(false)
const result = ref('')
const sourceLang = ref(localStorage.getItem('dodo-reader.sourceLang') || 'auto')
const targetLang = ref(localStorage.getItem('dodo-reader.targetLang') || navigator.language)
const sourceLangs = ref({ auto: t('autoCheck'), ...langs })
const targetLangs = ref({ ...langs })

// webviewMessages.sendContents((messages as any)[navigator.language || 'en-US'])

watch(
  () => sourceLang.value,
  (v) => {
    localStorage.setItem('dodo-reader.sourceLang', v)
  }
)
watch(
  () => targetLang.value,
  (v) => {
    localStorage.setItem('dodo-reader.targetLang', v)
  }
)

function processTextNodes(node: Node) {
  if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
    const parent = node.parentElement
    if (parent && !['script', 'style'].includes(parent.tagName.toLowerCase())) {
      // 获取当前文本颜色
      const computedStyle = getComputedStyle(parent)
      const currentColor = computedStyle.color

      // 如果是深色文本，改为浅色
      if (isColorDark(currentColor)) {
        parent.style.color = invertTextColor(currentColor)
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // 处理元素节点的背景色
    const element = node as HTMLElement
    const computedStyle = getComputedStyle(element)
    const backgroundColor = computedStyle.backgroundColor

    // 如果有深色背景，改为浅色背景
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      if (!isColorDark(backgroundColor)) {
        element.style.backgroundColor = invertBackgroundColor(backgroundColor)
      }
    }

    // 递归处理子节点
    node.childNodes.forEach(processTextNodes)
  }
}

// 判断颜色是否为深色
function isColorDark(color: string): boolean {
  // 解析颜色值
  const rgb = parseColor(color)
  if (!rgb) return false

  // 计算亮度 (基于人眼对RGB的感知)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness < 128 // 小于128认为是深色
}

// 解析颜色字符串为RGB对象
function parseColor(color: string): { r: number; g: number; b: number } | null {
  if (color.startsWith('rgb')) {
    const matches = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (matches) {
      return {
        r: parseInt(matches[1], 10),
        g: parseInt(matches[2], 10),
        b: parseInt(matches[3], 10),
      }
    }
  } else if (color.startsWith('#')) {
    let hex = color.substring(1)
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((h) => h + h)
        .join('')
    }
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    }
  }
  return null
}

// 反转文本颜色
function invertTextColor(color: string): string {
  const rgb = parseColor(color)

  if (!rgb) return '#ffffff'

  // 如果是黑色或深色，变为白色
  if (rgb.r < 20 && rgb.g < 20 && rgb.b < 20) {
    return '#ffffff'
  }

  // 如果是灰色，变为浅灰色
  if (Math.abs(rgb.r - rgb.g) < 30 && Math.abs(rgb.g - rgb.b) < 30 && Math.abs(rgb.r - rgb.b) < 30) {
    return `rgb(${Math.min(255, rgb.r + 100)}, ${Math.min(255, rgb.g + 100)}, ${Math.min(255, rgb.b + 100)})`
  }

  return color
}

// 反转背景颜色
function invertBackgroundColor(color: string): string {
  const rgb = parseColor(color)
  if (!rgb) return 'transparent'

  // 如果是浅色背景，变为深色
  return `rgb(${Math.max(0, rgb.r - 50)}, ${Math.max(0, rgb.g - 50)}, ${Math.max(0, rgb.b - 50)})`
}

onMounted(() => {
  // Load the eBook using ePub.js with the provided file data
  book = ePub(window.fileData)

  // Render the eBook to the specified viewer with certain display settings
  rendition = book.renderTo(viewer.value, {
    width: '100%',
    height: '100%',
    flow: 'scrolled-doc',
  })

  // Load the eBook's navigation data (table of contents)
  book.loaded.navigation.then((v: any) => {
    toc.value = v.toc
    // webviewMessages.setTOC(v.toc)
  })

  // Listen for changes in the eBook's location (relocation)
  rendition.on('relocated', function (location: any) {
    currentLoc.value = getCurrentLoc(location.start.href) // Update the current location
    localStorage.setItem(`${book.key()}_pos`, location.start.cfi)
  })

  // rendition.on('selected', function (cfiRange: string, contents: any) {
  //   const selection = contents.window.getSelection()
  //   if (selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0)
  //     const rect = range.getBoundingClientRect()
  //     menusLeft.value = rect.left
  //     menusTop.value = rect.top - viewer.value.querySelector('.epub-container').scrollTop
  //     showMenus.value = true
  //     selectionContent.value = selection.toString()
  //   }
  // })

  const doc = document.documentElement
  // Register a hook to modify the eBook's content
  rendition.hooks.content.register((contents: any) => {
    // Apply the same CSS styles as the document's root element
    contents.document.documentElement.style.cssText = doc.style.cssText
    currentDoc = contents.document

    webviewMessages.getConfig().then((config: any) => {
      if (config.isDarkTheme) {
        processTextNodes(contents.document.body)
      }
    })

    // Listen Uncheck and hide button
    // currentDoc.addEventListener('selectionchange', () => {
    //   if (!contents.window.getSelection().toString()) {
    //     showMenus.value = false
    //   }
    // })
    const selection = contents.window.getSelection()
    currentDoc.addEventListener('mouseup', async (event: any) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (selection.toString()) {
        menusLeft.value = event.clientX
        menusTop.value = event.clientY - viewer.value.querySelector('.epub-container').scrollTop
        container.value.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            clientX: tocShow.value ? menusLeft.value + sideWidth.value : menusLeft.value,
            clientY: menusTop.value,
          })
        )
        selectionContent.value = selection.toString()
      } else {
        translationVisible.value = false
      }
    })
    // Add custom stylesheet rules to the eBook content
    return contents.addStylesheetRules({
      html: {
        'background-color': 'var(--vscode-editor-background)',
      },
    })
  })

  // Perform actions when the eBook is ready
  book.ready.then(() => {
    // Display the eBook
    rendition.display(localStorage.getItem(`${book.key()}_pos`) || void 0)

    // Define a key listener function to navigate through pages using arrow keys
    const keyListener = function (e: any) {
      if ((e.keyCode || e.which) == 37) {
        // Left arrow key
        rendition.prev() // Show previous page
      }
      if ((e.keyCode || e.which) == 39) {
        // Right arrow key
        rendition.next() // Show next page
      }
    }
    // Attach the key listener to the document's keyup event
    document.addEventListener('keyup', keyListener)

    // Perform actions when a page is rendered
    rendition.on('rendered', (section: any) => {
      prevArrowShow.value = !!section.prev()
      nextArrowShow.value = !!section.next()
      rendition.on('keyup', keyListener) // Attach key listener for navigation
    })
  })

  webviewMessages.on(DO_COPY, () => {
    const textArea = document.createElement('textarea')
    textArea.value = selectionContent.value
    document.body.appendChild(textArea)
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      successful ? ElMessage.success(t('copySuccess')) : ElMessage.error(t('copyFail'))
    } catch (error) {
      ElMessage.error(t('copyFail'))
    }
    document.body.removeChild(textArea)
  })

  webviewMessages.on(DO_TRANSLATE, () => {
    translata()
    // translationVisible.value = true
  })

  webviewMessages.on(GET_CONTENT, () => {
    webviewMessages.getContent(selectionContent.value || currentDoc.body.innerText)
  })
})

const translata = () => {
  if (loading.value) {
    return
  }
  result.value = ''
  loading.value = true
  configPromise
    .then((config: any) => {
      return webviewMessages.fetch({
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
              content: t('systemMessage', {
                sourceLang: (langs as any)[sourceLang.value] ?? '',
                targetLang: (langs as any)[targetLang.value],
              }),
            },
            {
              role: 'user',
              content: selectionContent.value,
            },
          ],
        },
        responseType: 'stream',
      })
    })
    .then(async (res: any) => {
      translationVisible.value = true
      const reader = res.getReader()
      while (true) {
        const { done, value } = await reader.read()
        loading.value = false
        if (done) {
          break
        } else {
          const datas = value.split('\n\n')
          datas.forEach((list: string) => {
            const data = list.replace('data: ', '')
            if (data.startsWith('{')) {
              const json = JSON.parse(data)
              result.value += json.choices[0].delta?.content || ''
            }
          })
        }
      }
    })
    .catch(() => {
      loading.value = false
      ElMessage.error('Error.')
    })
}

// Determine positioning by comparing scroll position and anchor location
const getCurrentLoc = (target: string) => {
  const item = book.navigation.toc.find((item: any) => item.href.includes(target))
  if (item?.subitems.length > 0) {
    const scrollTop = viewer.value.querySelector('.epub-container').scrollTop
    const getTargetItem = (items: any): any => {
      let i = 0
      for (; i < items.length; i++) {
        const hash = items[i].href.split('#')[1]
        if (hash) {
          const el = currentDoc.getElementById(hash)
          if (el && el.offsetTop > viewer.value.offsetHeight + scrollTop) {
            break
          }
        }
      }
      if (i === 0) {
        return null
      }
      if (items[i - 1].subitems.length > 0) {
        const subitem = getTargetItem(items[i - 1].subitems)
        if (subitem) {
          return subitem
        }
      }
      return items[i - 1]
    }
    const subitem = getTargetItem(item.subitems)
    if (subitem) {
      return subitem
    }
  }
  return item
}

const onSelected = (item: any) => {
  rendition.display(item.href) // Display the selected content
}

const exchangeTocShow = () => {
  tocShow.value = !tocShow.value
  if (tocShow.value) {
    const active = epubToc.value.$el.querySelector('.active')
    const activeRect = active?.getBoundingClientRect()
    const docHeight = document.documentElement.clientHeight
    // If the bottom of the 'active' element is below the visible part of the document
    if (activeRect?.bottom > docHeight) {
      // Scroll the 'active' element into view, making it visible within the viewport
      active.scrollIntoView()
    }
  }
}

const onTransitionend = () => {
  rendition.manager.resize() // Resize the rendition manager
}

// Function to navigate to the previous page in the eBook
const toPrev = () => {
  rendition.prev()
}

// Function to navigate to the next page in the eBook
const toNext = () => {
  rendition.next()
}

const handleMousedown = (event: MouseEvent) => {
  const startX = event.clientX
  draging.value = true
  const initWidth = sideWidth.value
  const handleMousemove = (event: MouseEvent) => {
    let width = event.clientX - startX + initWidth
    if (width < 160) {
      width = 160
    }
    if (width > container.value.offsetWidth * 0.6) {
      width = container.value.offsetWidth * 0.6
    }
    sideWidth.value = width
  }
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('mouseup', () => {
    draging.value = false
    document.removeEventListener('mousemove', handleMousemove)
  })
}
</script>

<template>
  <div
    ref="container"
    data-vscode-context='{"preventDefaultContextMenuItems": true }'
    class="container"
    :style="{ '--side-width': tocShow ? sideWidth + 'px' : '0px' }"
  >
    <div class="aside" @transitionend="onTransitionend">
      <EpubToc ref="epubToc" v-if="toc.length > 0" :toc="toc" :currentLoc="currentLoc" @selected="onSelected"></EpubToc>
    </div>
    <div v-if="tocShow" class="sash" :class="{ hover: draging }" @mousedown="handleMousedown"></div>
    <div v-if="draging" class="sash-overlay"></div>
    <div ref="viewer" class="viewer">
      <!-- <SelectionMenus v-if="showMenus" :left="menusLeft" :top="menusTop" :content="selectionContent"></SelectionMenus> -->
      <!-- <el-popover placement="bottom" width="80%" :visible="translationVisible">
        <template #reference>
          <div class="translation" :style="{ left: menusLeft + 'px', top: menusTop + 'px' }"></div>
        </template>
        <div class="translate-content-selects">
          <el-select class="translate-content-select" v-model="sourceLang" placeholder="Select">
            <el-option v-for="(lang, key) in sourceLangs" :key="key" :label="lang" :value="key" />
          </el-select>
          <el-select class="translate-content-select" v-model="targetLang" placeholder="Select">
            <el-option v-for="(lang, key) in targetLangs" :key="key" :label="lang" :value="key" />
          </el-select>
          <el-button type="primary" :disabled="loading" @click="translata">{{ t('retranslate') }}</el-button>
        </div>
        <div class="translate-content-result">{{ result }}</div>
      </el-popover> -->
      <div v-if="prevArrowShow" class="icon icon-prev" @click="toPrev">
        <el-icon><ArrowLeftBold /></el-icon>
      </div>
      <div v-if="nextArrowShow" class="icon icon-next" @click="toNext">
        <el-icon><ArrowRightBold /></el-icon>
      </div>
      <div class="icon list-expand" @click="exchangeTocShow">
        <el-icon>
          <Fold v-if="tocShow" />
          <Expand v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style>
.epub-container {
  overflow-x: hidden !important;
}
</style>

<style scoped>
.container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}
.aside {
  position: relative;
  flex-shrink: 0;
  width: var(--side-width);
  height: 100%;
  overflow-y: auto;
  background-color: var(--vscode-editorWidget-background);
  transition: all 0.2s ease-out;
  user-select: none;
}

.sash {
  position: absolute;
  left: var(--side-width);
  top: 0;
  z-index: 999;
  margin-left: -4px;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
}
.sash:hover,
.sash.hover {
  background-color: var(--vscode-sash-hoverBorder);
}

.sash-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  user-select: none;
}
.icon {
  position: absolute;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}
.icon:hover {
  /* border-color: currentColor; */
  box-shadow: 0 0 3px #999;
}
.list-expand {
  left: 16px;
  top: 10px;
}
.icon-prev {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}
.icon-next {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}
.viewer {
  position: relative;
  width: calc(100% - var(--side-width));
  height: 100%;
  background-color: #fff;
}
.translation {
  position: absolute;
  z-index: 99;
  width: 0;
  height: 0;
}
.translate-content-selects {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.translate-content-select {
  width: 120px;
}
.translate-content-result {
  padding: 5px 11px;
  min-height: 120px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ePub from 'epubjs'
import EpubToc from './components/EpubToc.vue'
import { Expand, Fold, ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const viewer = ref()
const toc = ref([])
const tocShow = ref(false)
const currentLoc = ref('') // Current location within the ebook
const prevArrowShow = ref(false)
const nextArrowShow = ref(false)
const epubToc = ref()
let book: any = null // Variable to hold the eBook object
let rendition: any = null // Variable to hold the eBook rendition

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
  })

  // Listen for changes in the eBook's location (relocation)
  rendition.on('relocated', function (location: any) {
    localStorage.setItem(`${book.key()}_pos`, location.start.cfi)
  })

  const doc = document.documentElement
  // Register a hook to modify the eBook's content
  rendition.hooks.content.register((contents: any) => {
    // Apply the same CSS styles as the document's root element
    contents.document.documentElement.style.cssText = doc.style.cssText
    // Add custom stylesheet rules to the eBook content
    return contents.addStylesheetRules({
      body: {
        // color: 'var(--vscode-editor-foreground)'
        'background-color': '#fff',
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
      currentLoc.value = section // Update the current location
      rendition.on('keyup', keyListener) // Attach key listener for navigation
    })
  })
})

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
</script>

<template>
  <div class="container" :style="{ '--side-width': tocShow ? '240px' : 0 }">
    <div class="aside" @transitionend="onTransitionend">
      <EpubToc ref="epubToc" v-if="toc.length > 0" :toc="toc" :currentLoc="currentLoc" @selected="onSelected"></EpubToc>
    </div>
    <div ref="viewer" class="viewer" :style="{ width: tocShow ? 'calc(100% - 240px)' : '100%' }">
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
  height: 100%;
}
</style>

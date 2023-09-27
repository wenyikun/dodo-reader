<script lang="ts" setup>
import { PropType, onMounted, ref } from 'vue'

defineProps({
  toc: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  currentLoc: {
    type: Object as PropType<any>,
    default: () => Object.create(null),
  },
})
const emit = defineEmits(['selected'])
const tocRef = ref()

const handleClick = (item: any) => {
  emit('selected', item)
}
</script>

<template>
  <ul class="toc" ref="tocRef">
    <li v-for="item in toc" :key="item.id" @click.stop="handleClick(item)">
      <span :class="{ active: currentLoc.href === item.href }">{{ item.label }}</span>
      <EpubToc
        v-if="item.subitems.length"
        :toc="item.subitems"
        @selected="handleClick"
        :currentLoc="currentLoc"
      ></EpubToc>
    </li>
  </ul>
</template>

<style scoped>
.toc {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 16px;
}
.toc li > ul {
  padding: 6px 10px;
  font-size: 0.9em;
}
.toc li span {
  display: block;
  padding: 4px 5px 4px 8px;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.toc li span:hover {
  background-color: var(--vscode-list-hoverBackground);
}
.toc li span.active {
  background-color: var(--vscode-list-inactiveSelectionBackground);
}
</style>

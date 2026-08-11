<template>
  <a-dropdown placement="bottomRight">
    <span :class="prefixCls">
      <GlobalOutlined :class="prefixCls"/>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="currentLang" @click="changeLang">
        <a-menu-item v-for="locale in locales" :key="locale">
          {{ languageLabels[locale] }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import storage from 'store'
const { locale } = useI18n()
const props = defineProps({
  prefixCls: {
    type: String,
    default: 'pro-drop-down'
  }
})
const locales = ['zh-CN', 'en-US']
const languageLabels = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}
const currentLang = ref([storage.get('select-lang-value')||'zh-CN'])
const changeLang = ({ key }) => {
  currentLang.value = [key]
  storage.set('select-lang-value', key)
  locale.value = key
}
</script>

<style lang="less" scoped>
.pro-drop-down{
cursor: pointer;
padding: 0 10px;
}
</style>

<template>
  <div :class="wrpCls">
    <a-space size="large">
      <a-button type="link" @click="toData">数据驾驶舱</a-button>
    </a-space>
    <AvatarDropdown :menu="showMenu" :class="prefixCls" />
    <SelectLang :class="prefixCls" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AvatarDropdown from './AvatarDropdown.vue';
import SelectLang from '@/components/SelectLang/SelectLang.vue';
const toData = () => { 
  window.open('/#/data/Index');
}

// Props 定义
const props = defineProps({
  prefixCls: {
    type: String,
    default: 'ant-pro-global-header-index-action'
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  topMenu: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    required: true
  }
});

// 使用 ref 或 reactive 定义响应式数据
const showMenu = ref(true);
// 计算属性
const wrpCls = computed(() => ({
  'ant-pro-global-header-index-right': true,
  [`ant-pro-global-header-index-${(props.isMobile || !props.topMenu) ? 'light' : props.theme}`]: true
}));

</script>

<style scoped>
</style>
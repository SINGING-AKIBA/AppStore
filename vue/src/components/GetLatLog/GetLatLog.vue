<template>
  <div>
    <a-input-search v-model:value="logLat" @search="onSearch">
      <template #enterButton>
        <a-button type="primary">
          选择定位
        </a-button>
      </template>
    </a-input-search>

    <a-modal
      :open="visible"
      :width="980"
      @cancel="handleCancel"
      :footer="null"
      :body-style="{ padding: '0' }"
      :centered="true"
    >
      <iframe id="map" src="/static/getLatLog/index.html"></iframe>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// 使用 props 和 emit 定义
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue', 'handelAddress']);

// 数据定义
const logLat = ref('');
const visible = ref(false);
const sValue = ref([]);
const address = ref('');
const allowProps = ref(true);

// 监听父组件传递的数据变化
watch(() => props.modelValue, (val) => {
  if (val.length === 2 && allowProps.value) {
    logLat.value = val.join(',');
    sValue.value = val;
    onChange();
  }
}, { immediate: true });

// 生命周期钩子：在组件挂载时设置全局函数
onMounted(() => {
  window.setCoordinate = setCoordinate;
});

// 方法定义
function setCoordinate(val, addr) {
  allowProps.value = false;
  const arr = val.split(',');
  logLat.value = `${arr[1]},${arr[0]}`;
  sValue.value = [parseFloat(arr[1]), parseFloat(arr[0])];
  address.value = addr;
  onChange();
  handleCancel();
}

function onSearch() {
  visible.value = true;
}

function handleCancel() {
  visible.value = false;
}

function onChange() {
  emit('update:modelValue', sValue.value);
  if (address.value !== '') {
    emit('handelAddress', address.value);
  }
}
</script>

<style lang="less" scoped>
#map {
  width: 920px;
  height: 620px;
  overflow: hidden;
}
</style>
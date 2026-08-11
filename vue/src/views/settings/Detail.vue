<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="配置标题">{{detailData.key}}</a-descriptions-item>
        <a-descriptions-item label="配置描述">{{detailData.describe}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="配置json数据" :column="20">
        <a-descriptions-item ><div v-html="detailData.values"></div></a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Settings'
defineOptions({
  inheritAttrs: false,
  name: 'settings.Detail'
})

// 响应式状态
const isLoading = ref(true)
const detailData = ref({})
const route = useRoute()
const router = useRouter()



// 方法
const getDetail = async () => {
  isLoading.value = true
  try {
    const res = await detail({ id: route.query.id })
    detailData.value = res.data
  } finally {
    isLoading.value = false
  }
}

const getAppendValue = (list, key) => {
  if (!list) return '-'
  return list[key] || list.map(item => item[key]).join(' ') || '-'
}

const onBack = () => {
  router.push('index')
}

// 生命周期
onMounted(() => {
  getDetail()
})
</script>

<style scoped></style>
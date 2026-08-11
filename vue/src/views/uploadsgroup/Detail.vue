<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="分组名称">{{detailData.name}}</a-descriptions-item>
        <a-descriptions-item label="上级分组ID">{{detailData.pid}}</a-descriptions-item>
        <a-descriptions-item label="排序(数字越小越靠前)">{{detailData.sort}}</a-descriptions-item>

      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/UploadsGroup'
defineOptions({
  inheritAttrs: false,
  name: 'uploadsgroup.Detail'
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
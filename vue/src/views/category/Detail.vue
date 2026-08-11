<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="名称">{{detailData.name}}</a-descriptions-item>
        <a-descriptions-item label="上级ID">{{detailData.pid}}</a-descriptions-item>
        <a-descriptions-item label="排序">{{detailData.sort}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="图标" :column="20">
        <a-descriptions-item ><div class='table-image'><a-image :src="detailData?.iconList?.url" /></div></a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick,debounce } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Category'
defineOptions({
  inheritAttrs: false,
  name: 'category.Detail'
})

// 响应式状态
const isLoading = ref(true)
const detailData = ref({})
const route = useRoute()
const router = useRouter()



// 方法
const getDetail = () => {
  detail({ id: route.query.id }).then(res => {
    detailData.value = res.data
    isLoading.value = false
  })
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
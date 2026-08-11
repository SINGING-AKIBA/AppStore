<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="文件分组ID">{{detailData.group_id}}</a-descriptions-item>
        <a-descriptions-item label="上传来源(10总后台,20商户后台,30客户端)">{{detailData.channel}}</a-descriptions-item>
        <a-descriptions-item label="存储方式">{{detailData.storage}}</a-descriptions-item>
        <a-descriptions-item label="存储域名">{{detailData.domain}}</a-descriptions-item>
        <a-descriptions-item label="文件类型(10图片 20附件 30视频)">{{detailData.type}}</a-descriptions-item>
        <a-descriptions-item label="文件名称">{{detailData.name}}</a-descriptions-item>
        <a-descriptions-item label="文件路径">{{detailData.path}}</a-descriptions-item>
        <a-descriptions-item label="文件大小(字节)">{{detailData.size}}</a-descriptions-item>
        <a-descriptions-item label="文件扩展名">{{detailData.ext}}</a-descriptions-item>
        <a-descriptions-item label="文件封面">{{detailData.cover}}</a-descriptions-item>
        <a-descriptions-item label="用户ID">{{detailData.user_id}}</a-descriptions-item>
        <a-descriptions-item label="是否在回收站(0不是10是）">{{detailData.is_recycle}}</a-descriptions-item>

      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Uploads'
defineOptions({
  inheritAttrs: false,
  name: 'uploads.Detail'
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
<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="应用名称">{{detailData.name}}</a-descriptions-item>
        <a-descriptions-item label="应用唯一标识键">{{detailData.app_key}}</a-descriptions-item>
        <a-descriptions-item label="副标题/标语">{{detailData.subtitle}}</a-descriptions-item>
        <a-descriptions-item label="开发商/公司名称">{{detailData.company}}</a-descriptions-item>
        <a-descriptions-item label="分类">{{detailData.category}}</a-descriptions-item>
        <a-descriptions-item label="年龄评级">{{{"4+":"4+","9+":"9+","12+":"12+","17+":"17+"}[detailData.age_rating]}}</a-descriptions-item>
        <a-descriptions-item label="用户评分（0.0-5.0）">{{detailData.rating}}</a-descriptions-item>
        <a-descriptions-item label="评分数">{{detailData.rating_count}}</a-descriptions-item>
        <a-descriptions-item label="版权信息">{{detailData.copyright}}</a-descriptions-item>
        <a-descriptions-item label="隐私政策链接">{{detailData.privacy_url}}</a-descriptions-item>
        <a-descriptions-item label="服务条款链接">{{detailData.terms_url}}</a-descriptions-item>
        <a-descriptions-item label="联系我们/技术支持链接">{{detailData.support_url}}</a-descriptions-item>
        <a-descriptions-item label="状态">{{{"10":"上架","20":"下架"}[detailData.status]}}</a-descriptions-item>
        <a-descriptions-item label="排序权重">{{detailData.sort_order}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="应用图标URL" :column="20">
        <a-descriptions-item ><div class='table-image'><a-image v-for="i in (detailData.icon ? detailData.icon.split(','):[])" :src="i" :key="i" /></div></a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="应用描述" :column="20">
        <a-descriptions-item >{{detailData.description}}</a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/AppInfo'
defineOptions({
  inheritAttrs: false,
  name: 'appinfo.Detail'
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
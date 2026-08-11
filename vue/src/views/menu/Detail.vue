<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="类型">{{detailData.type}}</a-descriptions-item>
        <a-descriptions-item label="父级ID">{{detailData.pid}}</a-descriptions-item>
        <a-descriptions-item label="名称">{{detailData.title}}</a-descriptions-item>
        <a-descriptions-item label="路径地址">{{detailData.path}}</a-descriptions-item>
        <a-descriptions-item label="排序">{{detailData.weigh}}</a-descriptions-item>
        <a-descriptions-item label="状态">{{{"10":"显示","20":"隐藏"}[detailData.status]}}</a-descriptions-item>
        <a-descriptions-item label="打开方式">{{{"10":"_self","20":"_blank","30":"_top","40":"_parent"}[detailData.target]}}</a-descriptions-item>
        <a-descriptions-item label="10显示20隐藏">{{detailData.show}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="图标" :column="20">
        <a-descriptions-item ><div class='table-image'><a-image v-for="i in (detailData.icon ? detailData.icon.split(','):[])" :src="i" :key="i" /></div></a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Menu'
defineOptions({
  inheritAttrs: false,
  name: 'menu.Detail'
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
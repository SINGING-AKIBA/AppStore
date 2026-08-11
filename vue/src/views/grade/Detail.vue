<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="等级名称">{{detailData.name}}</a-descriptions-item>
        <a-descriptions-item label="所需经验值">{{detailData.min_exp_number}}</a-descriptions-item>
        <a-descriptions-item label="排序">{{detailData.sort_number}}</a-descriptions-item>
        <a-descriptions-item label="默认等级">{{{"0":"否","1":"是"}[detailData.is_default_switch]}}</a-descriptions-item>
        <a-descriptions-item label="状态">{{{"10":"启用","20":"禁用"}[detailData.status]}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="等级图标" :column="20">
        <a-descriptions-item ><div class='table-image'><a-image v-for="i in (detailData.icon_image ? detailData.icon_image.split(','):[])" :src="i" :key="i" /></div></a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="权益描述" :column="20">
        <a-descriptions-item >{{detailData.benefit_desc}}</a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick,debounce } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Grade'
defineOptions({
  inheritAttrs: false,
  name: 'grade.Detail'
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
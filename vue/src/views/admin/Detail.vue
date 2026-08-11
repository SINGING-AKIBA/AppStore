<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="用户名">{{detailData.username}}</a-descriptions-item>
        <a-descriptions-item label="登录密码">{{detailData.password}}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{detailData.real_name}}</a-descriptions-item>
        <a-descriptions-item label="是否为超级管理员1是0不是">{{detailData.is_super}}</a-descriptions-item>
        <a-descriptions-item label="undefined">{{detailData.user_id}}</a-descriptions-item>
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
import { detail } from '@/api/Admin'
defineOptions({
  inheritAttrs: false,
  name: 'admin.Detail'
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
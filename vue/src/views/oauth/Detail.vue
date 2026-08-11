<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="用户ID">{{detailData.user_id}}</a-descriptions-item>
        <a-descriptions-item label="第三方名称">{{detailData.oauth_type}}</a-descriptions-item>
        <a-descriptions-item label="第三方用户唯一标识">{{detailData.openid}}</a-descriptions-item>
        <a-descriptions-item label="微信unionID">{{detailData.unionid}}</a-descriptions-item>

      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/Oauth'
defineOptions({
  inheritAttrs: false,
  name: 'oauth.Detail'
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
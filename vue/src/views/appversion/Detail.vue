<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="APP ID">{{detailData.app_info_id}}</a-descriptions-item>
        <a-descriptions-item label="版本号">{{detailData.version}}</a-descriptions-item>
        <a-descriptions-item label="内部版本号">{{detailData.version_code}}</a-descriptions-item>
        <a-descriptions-item label="安装包大小">{{detailData.size}}</a-descriptions-item>
        <a-descriptions-item label="iOS最低支持版本">{{detailData.min_os_ios}}</a-descriptions-item>
        <a-descriptions-item label="Android最低支持版本">{{detailData.min_os_android}}</a-descriptions-item>
        <a-descriptions-item label="iOS App Store下载链接">{{detailData.ios_url}}</a-descriptions-item>
        <a-descriptions-item label="iOS App Store ID">{{detailData.ios_appstore}}</a-descriptions-item>
        <a-descriptions-item label="Android APK下载链接">{{detailData.android_url}}</a-descriptions-item>
        <a-descriptions-item label="适用平台">{{{"ios":"iOS","android":"安卓"}[detailData.platform]}}</a-descriptions-item>
        <a-descriptions-item label="强制更新开关">{{{"0":"非强制","1":"强制"}[detailData.force_update_switch]}}</a-descriptions-item>
        <a-descriptions-item label="状态">{{{"10":"草稿","20":"已发布","30":"已回滚"}[detailData.status]}}</a-descriptions-item>
        <a-descriptions-item label="发布时间">{{detailData.publish_time}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="更新日志/新特性说明" :column="20">
        <a-descriptions-item >{{detailData.changelog}}</a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/AppVersion'
defineOptions({
  inheritAttrs: false,
  name: 'appversion.Detail'
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
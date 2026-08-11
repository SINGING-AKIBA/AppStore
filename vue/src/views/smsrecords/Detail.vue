<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="手机号">{{detailData.mobile}}</a-descriptions-item>
        <a-descriptions-item label="短信类型">{{{"1":"验证码","2":"通知短信","3":"营销短信","4":"系统消息"}[detailData.type]}}</a-descriptions-item>
        <a-descriptions-item label="发送状态">{{{"10":"待发送","20":"发送成功","30":"发送失败"}[detailData.status]}}</a-descriptions-item>
        <a-descriptions-item label="是否成功">{{{"0":"失败","1":"成功"}[detailData.success_switch]}}</a-descriptions-item>
        <a-descriptions-item label="短信模板ID">{{detailData.templateId}}</a-descriptions-item>
        <a-descriptions-item label="用户ID">{{detailData.user_id}}</a-descriptions-item>
        <a-descriptions-item label="短信平台">{{detailData.platform}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="短信内容" :column="20">
        <a-descriptions-item ><div v-html="detailData.content"></div></a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="返回结果信息" :column="20">
        <a-descriptions-item >{{detailData.result_textarea}}</a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick,debounce } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/SmsRecords'
defineOptions({
  inheritAttrs: false,
  name: 'smsrecords.Detail'
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
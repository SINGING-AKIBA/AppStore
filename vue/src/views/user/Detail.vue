<template>
  <a-card :loading="isLoading">
      <a-descriptions title="基本信息" :column="4">
        <a-descriptions-item label="用户昵称">{{detailData.nick_name}}</a-descriptions-item>
        <a-descriptions-item label="性别">{{{"0":"保密","1":"男","2":"女"}[detailData.gender]}}</a-descriptions-item>
        <a-descriptions-item label="注册来源">{{{"H5":"web","APP":"app","MP-WEIXIN":"微信小程序","MP-ALIPAY":"支付宝小程序","MP-TOUTIAO":"抖音小程序","MP-QQ":"QQ小程序","MP-KUAISHOU":"快手小程序"}[detailData.platform]}}</a-descriptions-item>
        <a-descriptions-item label="国家">{{detailData.country}}</a-descriptions-item>
        <a-descriptions-item label="省份">{{detailData.province}}</a-descriptions-item>
        <a-descriptions-item label="城市">{{detailData.city}}</a-descriptions-item>
        <a-descriptions-item label="用户可用余额">{{detailData.balance}}</a-descriptions-item>
        <a-descriptions-item label="用户积分">{{detailData.points}}</a-descriptions-item>
        <a-descriptions-item label="用户手机号">{{detailData.mobile}}</a-descriptions-item>
        <a-descriptions-item label="真实姓名">{{detailData.real_name}}</a-descriptions-item>
        <a-descriptions-item label="会员等级ID">{{detailData.grade_id}}</a-descriptions-item>
        <a-descriptions-item label="最后登录时间">{{detailData.last_login_time}}</a-descriptions-item>
        <a-descriptions-item label="最后登录IP">{{detailData.last_login_ip}}</a-descriptions-item>
        <a-descriptions-item label="用户状态">{{{"10":"正常","20":"拉黑"}[detailData.status]}}</a-descriptions-item>

      </a-descriptions>

      <a-descriptions title="头像图片ID" :column="20">
        <a-descriptions-item ><div class='table-image'><a-image :src="detailData?.avatarImgList?.url" /></div></a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="拉黑原因" :column="20">
        <a-descriptions-item >{{detailData.message}}</a-descriptions-item>
      </a-descriptions>

    <a-button @click="onBack">返回</a-button>
  </a-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { pick,debounce } from 'lodash'
import { ref, onMounted,reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detail } from '@/api/User'
defineOptions({
  inheritAttrs: false,
  name: 'user.Detail'
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
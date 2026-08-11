<template>
  <a-card>
    <a-result class="page-404" :status="status" :title="status" :sub-title="subTitleList[status]">
      <template #extra>
        <a-button type="primary" @click="toHome">
          返回首页
        </a-button>
      </template>
    </a-result>
  </a-card>
  
</template>

<script setup>
import { ref,watch } from 'vue';
import { useRouter,useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute();
const subTitleList = {
  '404': 'Sorry, the page you visited does not exist.',
  '403': 'Sorry, you are not authorized to access this page.',
  '500': 'Sorry, the server is reporting an error.'
}
const status = ref('404');
//获取路径
watch(() => route.path, (newPath) => {
  if (['/404', '/403', '/500'].includes(newPath)) {
    status.value = newPath.replace('/', '');
  }
}, { immediate: true });

const toHome = () => {
  router.push('/')
}
</script>

<style>
</style>
<template>
  <a-card>
    <a-page-header @back="() => router.back()" title="编辑队列">
      <template #extra>
        <a-button @click="handleSubmit" type="primary" :loading="loading">
          <SaveOutlined /> 保存
        </a-button>
      </template>
    </a-page-header>
    
    <a-alert type="info" show-icon class="mb-4">
      <template #message>
        BullMQ 队列配置通常由应用程序代码管理，无法在此处编辑。
      </template>
    </a-alert>
  </a-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'queue.Update'
})

const router = useRouter();
const loading = ref(false);

const handleSubmit = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.back();
  }, 500);
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>

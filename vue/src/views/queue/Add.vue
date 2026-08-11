<template>
  <a-card>
    <a-page-header @back="() => router.back()" title="添加任务">
      <template #extra>
        <a-button @click="handleSubmit" type="primary" :loading="loading">
          <SaveOutlined /> 保存
        </a-button>
      </template>
    </a-page-header>
    
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style:{width: '120px'} }"
      :wrapper-col="{ style:{width: '400px'} }"
    >
      <a-form-item name="name" label="队列名称">
        <a-input v-model:value="formData.name" placeholder="请输入队列名称" />
      </a-form-item>
      
      <a-form-item name="data" label="任务数据">
        <a-input.TextArea 
          v-model:value="formData.dataJson" 
          placeholder='请输入任务数据 (JSON格式)，如: {"key": "value"}'
          :rows="6"
        />
      </a-form-item>
      
      <a-form-item name="options" label="任务选项">
        <a-input.TextArea 
          v-model:value="formData.optionsJson"
          placeholder='请输入任务选项 (JSON格式)，如: {"attempts": 3, "delay": 1000}'
          :rows="4"
        />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { add } from '@/api/Queue';
import { message } from 'ant-design-vue';

defineOptions({
  name: 'queue.Add'
})

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  name: '',
  dataJson: '',
  optionsJson: ''
});

const rules = {
  name: [
    { required: true, message: '请输入队列名称', trigger: 'blur' }
  ]
};

const handleSubmit = () => {
  formRef.value.validate().then(() => {
    loading.value = true;
    
    let data = {};
    let options = {};
    
    try {
      if (formData.dataJson) {
        data = JSON.parse(formData.dataJson);
      }
    } catch (e) {
      message.error('任务数据必须是有效的JSON格式');
      loading.value = false;
      return;
    }
    
    try {
      if (formData.optionsJson) {
        options = JSON.parse(formData.optionsJson);
      }
    } catch (e) {
      message.error('任务选项必须是有效的JSON格式');
      loading.value = false;
      return;
    }
    
    add({
      name: formData.name,
      data: data,
      options: options
    }).then(() => {
      message.success('任务添加成功');
      router.back();
    }).catch(() => {
      message.error('任务添加失败');
    }).finally(() => {
      loading.value = false;
    });
  });
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>

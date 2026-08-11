<template>
  <a-card>
    <a-form :model="form" :rules="rules" ref="ruleForm" @finish="handleSubmit" @finishFailed="finishFailed"> 
      <a-row :gutter="40">
        <a-col :span="8">
          <a-divider orientation="left">用户协议</a-divider>
          <a-form-item name="user_agreement">
            <ueditor v-model="form.user_agreement" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-divider orientation="left">隐私协议</a-divider>
          <a-form-item name="privacy_agreement">
            <ueditor v-model="form.privacy_agreement" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="40">
        <a-col :span="8">
          <a-divider orientation="left">关于我们</a-divider>
          <a-form-item name="about">
            <ueditor v-model="form.about" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-divider orientation="left">联系我们</a-divider>
          <a-form-item name="contact">
            <ueditor v-model="form.contact" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 6 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getSettings, setSettings } from '@/api/Setting';

defineOptions({
  inheritAttrs: false,
  name: 'setting.Agreement'
})

// Form model
const form = reactive({
  user_agreement: '',
  privacy_agreement: '',
  about: '',
  contact: ''
});

// Validation rules
const rules = {
  user_agreement: [{ required: true, message: '请输入用户协议内容', trigger: 'blur' }],
  privacy_agreement: [{ required: true, message: '请输入隐私协议内容', trigger: 'blur' }],
  about: [{ required: true, message: '请输入关于我们内容', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系我们内容', trigger: 'blur' }]
};

// Loading state
const loading = ref(false);

// Form reference for validation
const ruleForm = ref(null);

// Fetch settings on mount
onMounted(async () => {
  try {
    const res = await getSettings({ key: "agreement_setting" });
    Object.assign(form, res.data);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
});


// Handle form submission
const handleSubmit = async (values) => {
  try {
    loading.value = true;
    await setSettings({ data: values, key: "agreement_setting" });
    message.success("保存成功");
  } catch (error) {
    if (error !== 'cancel') {
      message.error("保存失败，请重试。");
      console.error('Validation or saving failed:', error);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
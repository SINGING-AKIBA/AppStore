<template>
  <a-card>
    <a-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 6 }"
      @finish="handleSubmit"
    >
      <a-form-item :label="$t('Old Password')" prop="old_password">
        <a-input-password v-model:value="form.old_password" :placeholder="$t('Please enter your old password')"></a-input-password>
      </a-form-item>

      <a-form-item :label="$t('New Password')" prop="new_password">
        <a-input-password v-model:value="form.new_password" :placeholder="$t('Please enter your new password')"></a-input-password>
      </a-form-item>

      <a-form-item :label="$t('Confirm Password')" prop="confirm_password">
        <a-input-password v-model:value="form.confirm_password" :placeholder="$t('Please enter the confirmation password')"></a-input-password>
      </a-form-item>

      <a-form-item class="mt-20" :wrapper-col="{ span: 6, offset: 3 }">
        <a-button type="primary" html-type="submit" :loading="isBtnLoading">{{ $t('submit') }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { settings } from '@/api/Admin';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据和规则
const form = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
});

const rules = {
  old_password: [{ required: true, message: t('Please enter your old password'), trigger: 'blur' }],
  new_password: [{ required: true, message: t('Please enter your new password'), trigger: 'blur' }],
  confirm_password: [{ required: true, message: t('Please enter the confirmation password'), trigger: 'blur' }]
};

// 表单引用
const ruleForm = ref(null);
const isBtnLoading = ref(false);
const router = useRouter();

// 提交表单
const handleSubmit = (values) => {
  isBtnLoading.value = true;
  if(values.new_password !== values.confirm_password){
    message.error(t('The two passwords do not match'));
    isBtnLoading.value = false;
    return;
  }
  settings(values)
    .then((res) => {
      message.success(res.msg, 1.5);
      router.push('/index');
    })
    .catch(() => {
      isBtnLoading.value = false;
    });
};
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}
</style>
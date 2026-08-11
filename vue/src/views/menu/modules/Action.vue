<template>
  <a-modal :open="visible" :title="title" destroy-on-close @cancel="handleCancel" @ok="handleOk">
    <a-form :model="form" :rules="rules" ref="formRef">
      <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请输入名称' }]">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="路径" name="path" :rules="[{ required: true, message: '请输入路径' }]">
        <a-input v-model:value="form.path" />
      </a-form-item>
      <a-form-item label="排序" name="weigh" :rules="[{ required: true, message: '请输入排序' }]">
        <a-input-number v-model:value="form.weigh" :default-value="100" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { add } from '@/api/Menu';
import { message } from 'ant-design-vue';

const props = defineProps({
  record: Object,
});

const emit = defineEmits(['ok']);

const visible = ref(false);
const title = ref('添加操作');
const formRef = ref(null);

const form = reactive({
  title: '',
  path: '',
  weigh: 100,
});

const rules = reactive({
  title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  weigh: [{ required: true, message: '请输入排序', trigger: 'blur' }]
});

// 显示模态框，并设置父级菜单ID
const show = (record) => {
  if (record) {
    form['pid'] = record.id;
  }
  visible.value = true;
};

// 点击取消
const handleCancel = () => {
  visible.value = false;
  // 清空表单
  form.title = '';
  form.path = '';
  form.weigh = 100;
};

// 点击确定
const handleOk = () => {
  formRef.value.validateFields().then(values => {
    const menuData = {
      ...form,
      type: 30,
      target: 10,
      status: 10,
      pid: form.pid || 0,
      show: 20
    };
    
    add(menuData).then(() => {
      message.success('添加成功');
      handleCancel();
      emit('ok');
    })
  });
};
defineExpose({
  show
});
</script>
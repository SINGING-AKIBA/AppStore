<template>
    <a-modal v-model:open="visible" :title="title" @cancel="handleCancel" @ok="handleOk" >
      <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="管理员用名称" name="username">
          <a-input v-model:value="formData.username" placeholder="请输入管理员用户名称"/>
        </a-form-item>
        <a-form-item label="管理员姓名" name="real_name">
          <a-input v-model:value="formData.real_name" placeholder="请输入管理员姓名"/>
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="formData.sort" placeholder="请输入排序"/>
        </a-form-item>
        <a-form-item label="角色" name="roles">
          <a-select mode="multiple" show-arrow allow-clear v-model:value="formData.roles" placeholder="请选择角色">
            <a-select-option value="is_super" v-if="userInfo.is_super === 1">超级管理员</a-select-option>
            <a-select-option v-for="role in roles" :key="role" :value="role">{{ role }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="登陆密码" name="password" v-if="add">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码"/>
        </a-form-item>
        <a-form-item label="确认密码" name="confirm_password" v-if="add">
          <a-input-password v-model:value="formData.confirm_password" placeholder="请再次输入密码"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup>
  import { reactive, ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { add as userAdd, roles as getRoles, update } from '@/api/Admin';
  import { getInfo } from '@/api/Login'
  const emit = defineEmits(['onsubmit']);
  
  const formRef = ref(null);
  const visible = ref(false);
  const title = ref('添加管理员');
  const add = ref(true);
  const id = ref(null);
  const roles = ref([]);
  const userInfo = ref({});
  const formData = reactive({
    username: '',
    real_name: '',
    sort: 100,
    roles: [],
    password: '',
    confirm_password: ''
  });
  const rules = reactive({
    username: [{ required: true, message: '请输入管理员用户名', trigger: 'blur' }],
    real_name: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
    password: [{ required: add.value, message: '请输入密码', trigger: 'blur' }],
    confirm_password: [{ required: add.value, message: '请再次输入密码', trigger: 'blur' }]
  });
  
  // Fetch initial data
  onMounted(() => {
    getUserInfo();
    getRolesList();
  });
  
  // Show modal with optional item to edit
  const show = (item) => {
    visible.value = true;
    if (item) {
      add.value = false;
      title.value = '编辑管理员信息';
      id.value = item.id;
      Object.assign(formData, item);
    }
  };
  
  const handleCancel = () => {
    visible.value = false;
    id.value = null;
    title.value = '添加管理员';
    formRef.value.resetFields();
    add.value = true;
  };
  
  const handleOk = (values) => {
    formRef.value.validateFields().then(values=>{
      const action = id.value ? update : userAdd;
      action({ ...values, id: id.value }).then(() => {
        message.success(add.value ? '添加成功' : '修改成功');
        emit('onsubmit');
        handleCancel();
      });
    })
  };  
  
  // Get list of roles
  const getRolesList = () => {
    getRoles().then(({ data }) => {
      roles.value = data;
    });
  };
  
  // Get current user info
  const getUserInfo = () => {
    getInfo().then(({ data }) => {
      userInfo.value = data;
    });
  };

  defineExpose({
    show
  });
  </script>
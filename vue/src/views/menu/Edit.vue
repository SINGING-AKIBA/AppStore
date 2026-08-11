<template>
  <a-card>
    <a-form :model="form" :rules="rules" ref="formRef" @finish="handleSubmit" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
      <a-form-item label="父级菜单" name="pid">
        <a-tree-select v-model:value="form.pid" :tree-data="treeData" />
      </a-form-item>
      <a-form-item label="菜单名称" name="title" >
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="路径" name="path">
        <a-input v-model:value="form.path" />
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <a-input v-model:value="form.icon" />
      </a-form-item>
      <a-form-item label="排序" name="weigh">
        <a-input-number v-model:value="form.weigh" :default-value="100" />
      </a-form-item>
      <a-form-item label="菜单类型" name="type">
        <a-select v-model:value="form.type">
          <a-select-option :value="10">菜单</a-select-option>
          <a-select-option :value="20">路由</a-select-option>
          <a-select-option :value="30">操作</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否在菜单中显示" name="show">
        <a-select v-model:value="form.show">
          <a-select-option :value="10">是</a-select-option>
          <a-select-option :value="20">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="打开方式" name="target">
        <a-select v-model:value="form.target">
          <a-select-option :value="10">当前窗口</a-select-option>
          <a-select-option :value="20">新窗口</a-select-option>
          <a-select-option :value="30">top</a-select-option>
          <a-select-option :value="40">parent</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status" >
        <a-select v-model:value="form.status">
          <a-select-option :value="10">启用</a-select-option>
          <a-select-option :value="20">禁用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 3 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
        <a-button @click="onBack">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { index, edit, detail } from '@/api/Menu';
import { pick } from 'lodash';

const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const loading = ref(true);
const treeData = ref([]);
const id = ref('');

// 表单初始值
const form = reactive({
  pid: undefined,
  title: '',
  path: '',
  icon: '',
  weigh: 100,
  type: '',
  show: '',
  target: '',
  status: ''
});

// 表单验证规则
const rules = {
  pid: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  weigh: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  show: [{ required: true, message: '请选择是否在菜单中显示', trigger: 'change' }],
  target: [{ required: true, message: '请选择打开方式', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

// 获取菜单列表
const getMenuList = async () => {
  try {
    const res = await index();
    const data = res.data.map(item => ({
      title: item.meta.title,
      key: item.id,
      value: item.id,
      children: item.children?.filter(i => i.type !== 30).map(i => ({ title: i.meta.title, key: i.id, value: i.id })) || []
    }));
    treeData.value = [{ title: '一级菜单', key: 0, value: 0 }].concat(data);
  } finally {
    loading.value = false;
  }
};

// 获取详情
const getDetail = async () => {
  id.value = route.query.id;
  if (id.value) {
    try {
      const res = await detail({ id: id.value });
      Object.assign(form, pick(res.data, ['pid', 'title', 'path', 'icon', 'type', 'show', 'target', 'status', 'weigh']));
    } catch (error) {
      console.error('Failed to fetch detail:', error);
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    await formRef.value.validate();
    const formData = { ...form, id: id.value };
    await edit(formData);
    message.success('更新成功');
    setTimeout(() => {
      router.push('/menu/index');
    }, 1500);
  } catch (error) {
    loading.value = false;
    console.error('Validation failed or edit failed:', error);
  }
};

// 返回
const onBack = () => {
  router.push({path:'/menu/index'});
};

onMounted(async () => {
  await Promise.all([getMenuList(), getDetail()]);
});
</script>
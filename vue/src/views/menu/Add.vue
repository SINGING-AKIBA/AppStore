<template>
  <a-card>
    <a-form :model="form" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }"  @finish="handleSubmit">
      <a-form-item label="父级菜单" name="pid">
        <a-tree-select v-model:value="form.pid" :tree-data="treeData" />
      </a-form-item>
      <a-form-item label="菜单名称" name="title">
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
          <a-select-option value="10">菜单</a-select-option>
          <a-select-option value="20">路由</a-select-option>
          <a-select-option value="30">操作</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否在菜单中显示" name="show">
        <a-select v-model:value="form.show" :default-value="10">
          <a-select-option value="10">是</a-select-option>
          <a-select-option value="20">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="打开方式" name="target">
        <a-select v-model:value="form.target" :default-value="10">
          <a-select-option value="10">当前窗口</a-select-option>
          <a-select-option value="20">新窗口</a-select-option>
          <a-select-option value="30">top</a-select-option>
          <a-select-option value="40">parent</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="form.status" :default-value="10">
          <a-select-option value="10">启用</a-select-option>
          <a-select-option value="20">禁用</a-select-option>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { index, add } from '@/api/Menu';

const router = useRouter();
const loading = ref(true);
const treeData = ref([{}]);
const form = reactive({
  pid: 0,
  title: '',
  path: '',
  icon: '',
  weigh: 100,
  type: '',
  show: '10',
  target: '10',
  status: '10'
});
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

onMounted(() => {
  getMenuList();
});

const getMenuList = () => {
  index().then((res) => {
    const data = res.data.map((item) => ({
      title: item.meta.title,
      key: item.id,
      value: item.id,
      children: item.children?.filter(i => i.type !== 30).map(i => ({ title: i.meta.title, key: i.id, value: i.id })) || []
    }));
    treeData.value = [{ title: '一级菜单', key: 0, value: 0 }].concat(data);
    loading.value = false;
  });
};

const handleSubmit = (values) => {
  loading.value = true;
  add(values).then(() => {
    message.success('添加成功');
    setTimeout(() => {
      router.push('/menu/index');
    }, 1500);
  }).catch(() => {
    loading.value = false;
  });
};

const onBack = () => {
  router.push('/menu/index');
};
</script>
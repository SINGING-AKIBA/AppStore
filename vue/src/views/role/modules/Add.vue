<template>
  <a-modal 
    v-model:open="visible" 
    :title="title" 
    destroy-on-close 
    @cancel="handleCancel" 
    @ok="handleOk"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      ref="formRef"
    >
      <a-form-item 
        label="角色名称"
        name="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>
      
      <a-form-item label="角色权限">
        <a-tree
          v-model:checkedKeys="checkedKeys"
          show-line
          checkable
          :tree-data="treeData"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { add } from '@/api/Role';
import { index } from '@/api/Menu';

const props = defineProps({
  title: {
    type: String,
    default: '添加角色'
  }
});

const emit = defineEmits(['ok']);

const visible = ref(false);
const formRef = ref();
const treeData = ref([]);
const checkedKeys = ref([]);
const formState = reactive({
  name: ''
});

// 处理树形数据
const createTreeData = (data) => {
  if (!data.length) return [];
  return data.map(item => ({
    title: item.meta.title,
    key: item.path.toLowerCase(),
    children: item.children 
      ? createTreeData(item.children) 
      : item.permission ? createTreeData(item.permission) : []
  }));
};

const getMenuList = async () => {
  try {
    const res = await index();
    treeData.value = createTreeData(res.data);
  } catch (error) {
    message.error('获取菜单列表失败');
  }
};

const handleSubmit = async () => {
  try {
    const data = {
      ...formState,
      roles: checkedKeys.value
    };
    await add(data);
    message.success('添加成功');
    handleCancel();
    emit('ok');
  } catch (error) {
    message.error('添加失败');
  }
};

const show = () => {
  visible.value = true;
};

const handleCancel = () => {
  visible.value = false;
  formRef.value.resetFields();
  checkedKeys.value = [];
};

const handleOk = async () => {
  try {
    await formRef.value.validate();
    await handleSubmit();
  } catch (error) {
    console.log('验证失败:', error);
  }
};

onMounted(() => {
  getMenuList();
});

// 暴露方法给父组件
defineExpose({ show });
</script>
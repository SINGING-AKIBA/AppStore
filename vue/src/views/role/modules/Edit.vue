<template>
  <a-modal :open="visible" :title="title" destroyOnClose @cancel="handleCancel" @ok="handleOk">
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item label="角色名称">
        <a-input v-model:value="form.name" disabled />
      </a-form-item>
      <a-form-item label="角色权限">
        <a-tree v-if="!loading" @check="treeCheck" :checkedKeys="selectedKeys" checkStrictly showLine checkable :treeData="treeData"></a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { edit, permissions } from '@/api/Role';
import { index } from '@/api/Menu';
const emit = defineEmits(['ok']);
// 处理树形数据
function createTreeData(data) {
  if (data.length == 0) return [];
  return data.map((item) => {
    if (!item.children && item.permission) item.children = item.permission;
    let key = item.path.toLowerCase();
    if (item.path.lastIndexOf('/') === 0) {
      key = item.path + '/smile';
      key = key.toLowerCase();
    }
    return {
      title: item.meta.title,
      key: key,
      children: item.children && createTreeData(item.children)
    };
  });
}

const visible = ref(false);
const loading = ref(true);
const title = ref('编辑角色');
const form = ref({ name: '' });
const treeData = ref([]);
const selectedKeys = ref([]);

const getMenuList = () => {
  index().then(res => {
    treeData.value = createTreeData(res.data);
  });
};

const getRolePermission = (name) => {
  permissions({ role_name: name }).then(res => {
    if (res.data.length > 0) {
      const roles = res.data.map(i => `/${i[1]}/${i[2]}`);
      form.value.name = name;
      selectedKeys.value = roles;
      loading.value = false;
    }
  });
};

const handleCancel = () => {
  visible.value = false;
  loading.value = true;
  selectedKeys.value = [];
};

const handleSubmit = (data) => {
  data.roles = selectedKeys.value;
  edit(data).then(() => {
    handleCancel();
  });
};

const handleOk = () => {
  if (form.value.name) {
    handleSubmit(form.value);
  }
};

const show = (name) => {
  visible.value = true;
  getRolePermission(name);
};

defineExpose({
  show
});

function treeCheck(checkedKeys) {
  selectedKeys.value = checkedKeys.checked;
}

onMounted(() => {
  getMenuList();
});
</script>
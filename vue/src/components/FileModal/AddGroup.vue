<template>
  <a-modal
    :open="visible"
    :title="title"
    :confirmLoading="isLoading"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="上级分组" name="pid">
        <a-tree-select v-model:value="form.pid" :tree-data="treeData" :field-names="{ key: 'id', value: 'id', label: 'name' }" />
      </a-form-item>
      <a-form-item label="分组名称" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="form.sort" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
  
<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { group, addGroup } from '@/api/File';
import { message } from 'ant-design-vue';
const emit = defineEmits(['onsubmit']);
const formRef = ref(null);
const visible = ref(false);
const title = ref('添加分组');
const record = ref(null);
const isLoading = ref(false);
const form = reactive({
  pid: 0,
  name: '',
  sort: 100,
});
const treeData = ref([
{
    id: 0,
    name: '顶级分组',
}
]);

const show = (rec) => {
  visible.value = true;
  record.value = rec;
  if (rec) {
    title.value = '编辑分组';
    Object.assign(form, {
      pid: rec.pid,
      name: rec.name,
      sort: rec.sort,
    });
  }
};

const handleCancel = () => {
  visible.value = false;
  resetForm();
};

const handleOk = () => {
  isLoading.value = true;
  if(form.name === ''){
    message.error('分组名称不能为空');
    isLoading.value = false;
    return;
  }
  onFormSubmit(form);
};

const onFormSubmit = (data) => {
addGroup(data).then(() => {
    emit('onsubmit');
    visible.value = false;
    message.success('操作成功');
    isLoading.value = false;
    resetForm();
}).catch(err => {
    isLoading.value = false;
});
};

const resetForm = () => {
formRef.value.resetFields();
Object.assign(form, {
    pid: 0,
    name: '',
    sort: 100,
});
};

const getList = () => {
group().then(response => {
    treeData.value = [...treeData.value, ...(response.data.data || [])];
});
};

onMounted(() => {
  getList();
});
defineExpose({ show });
</script>
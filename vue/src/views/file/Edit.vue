<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="文件分组" name="group_id">
        <a-tree-select
          v-model:value="form.group_id"
          :tree-data="treeData"
          :replace-fields="{ key: 'id', value: 'id', label: 'name' }"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item label="文件名称" name="name">
        <a-input v-model:value="form.name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { editFile, group } from "@/api/File";

// 定义响应式数据
const title = ref("编辑文件信息");
const visible = ref(false);
const form = reactive({
  group_id: 0,
  name: "",
  id: "",
});
const record = ref({});
const treeData = ref([
  {
    id: 0,
    name: "未分组",
  },
]);

// 方法定义
const show = (rec) => {
  Object.assign(record.value, rec);
  visible.value = true;
  Object.assign(form, {
    group_id: record.value.group_id,
    name: record.value.name,
    id: record.value.id,
  });
};

const handleCancel = () => {
  visible.value = false;
};

const handleOk = () => {
  const values = { ...form };
  onFormSubmit(values);
};

const onFormSubmit = async (data) => {
  try {
    await editFile(data);
    emit("onsubmit");
    message.success("操作成功");
    visible.value = false;
    Object.keys(form).forEach((key) => (form[key] = ""));
  } catch (error) {
    console.error(error);
  }
};

const getList = async () => {
  try {
    const response = await group();
    treeData.value = [...treeData.value, ...(response.data?.data || [])];
  } catch (error) {
    console.error(error);
  }
};

// 生命周期钩子
onMounted(() => {
  getList();
});

// 定义事件发射器
const emit = defineEmits(["onsubmit"]);

// 暴露公共方法
defineExpose({ show });
</script>
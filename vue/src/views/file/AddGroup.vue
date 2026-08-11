<template>
    <a-modal
        v-model:open="visible"
        :title="title"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <a-form
            :model="form"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
        > 
          <a-form-item label='上级分组'>
            <a-tree-select
              v-model:value="form.pid"
              :treeData="treeData"
              :replaceFields="{ key: 'id', value: 'id', label: 'name' }"
            />
          </a-form-item>
          <a-form-item label='分组名称'>
            <a-input v-model:value="form.name" />
          </a-form-item>
          <a-form-item label='排序'>
            <a-input-number v-model:value="form.sort" :default-value="100" />
          </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { group, addGroup } from '@/api/File'

const props = defineProps({
  // 如果需要父组件传递数据，可以在这里定义
})

const emit = defineEmits(['onsubmit'])

const title = ref('添加分组')
const visible = ref(false)
const record = ref(null)
const form = reactive({
  pid: 0,
  name: '',
  sort: 100
})
const treeData = ref([
  {
    id: 0,
    name: '顶级分组',
    pid:0
  }
])

const show = (rec) => {
  visible.value = true
  record.value = rec
  if (rec) {
    title.value = '编辑分组'
    Object.assign(form, {
      pid: rec.pid,
      name: rec.name,
      sort: rec.sort
    })
  }
}

const handleCancel = () => {
  visible.value = false;
  resetForm()
}

const handleOk = async () => {
  try {
    await validate()
    if (record.value) form.id = record.value.id
    await onFormSubmit({ ...form })
  } catch (err) {
    console.error('Validation failed:', err)
  }
}

const validate = () => {
  // 这里应该有一个验证逻辑，具体取决于使用的表单库
  return Promise.resolve() // 假设总是成功
}

const onFormSubmit = async (data) => {
  try {
    await addGroup(data)
    emit('onsubmit')
    message.success('操作成功')
    visible.value = false
    resetForm()
  } catch (error) {
    console.error('Submit error:', error)
  }
}

const resetForm = () => {
  Object.assign(form, {
    pid: 0,
    name: '',
    sort: 100
  })
}
const createTreeData = (data, pid = 0) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  // 1. 构建 id -> node 的映射，并初始化 children
  const map = new Map();
  const roots = [];

  for (const item of data) {
    // 克隆对象避免修改原始数据（可选）
    const node = { ...item, children: [] };
    map.set(node.id, node);
  }

  // 2. 再次遍历，建立父子关系
  for (const item of data) {
    const node = map.get(item.id);
    if (item.pid === pid) {
      // 是根节点
      roots.push(node);
    } else {
      // 找到父节点，加入其 children
      const parent = map.get(item.pid);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return roots;
};
const getList = async () => {
  try {
    const response = await group()
    treeData.value = createTreeData([...treeData.value, ...(response.data.data || [])])
  } catch (error) {
    console.error('Get list error:', error)
  }
}

onMounted(() => {
  getList()
})
defineExpose({
  show
})
</script>

<style scoped>
/* 样式部分保持不变 */
</style>
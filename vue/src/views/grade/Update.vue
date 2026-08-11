<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="name" label="等级名称" :rules="[{required:true,message:'等级名称不能为空'}]">
          <a-input v-model:value="formData.name" placeholder="请输入等级名称" type="text" max="90" min="0"   />
        </a-form-item>
        <a-form-item name="icon_image" label="等级图标" >
          <select-image v-model="formData.icon_image"  getUrl :defaultList="detailData && detailData.icon_image ? [detailData.icon_image] : []"/>
        </a-form-item>
        <a-form-item name="min_exp_number" label="所需经验值" :rules="[{required:true,message:'所需经验值不能为空'}]">
          <a-input-number v-model:value="formData.min_exp_number" placeholder="请输入所需经验值"   min="0"  />
        </a-form-item>
        <a-form-item name="benefit_desc" label="权益描述" >
          <a-textarea v-model:value="formData.benefit_desc" placeholder="请输入权益描述" />
        </a-form-item>
        <a-form-item name="sort_number" label="排序" :rules="[{required:true,message:'排序不能为空'}]">
          <a-input-number v-model:value="formData.sort_number" placeholder="请输入排序"   min="0"  />
        </a-form-item>
        <a-form-item name="is_default_switch" label="默认等级" :rules="[{required:true,message:'默认等级不能为空'}]">
          <a-select v-model:value="formData.is_default_switch" placeholder="请选择默认等级" mode="default" allowClear ><a-select-option :value="0">否</a-select-option><a-select-option :value="1">是</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="status" label="状态" :rules="[{required:true,message:'状态不能为空'}]">
          <a-select v-model:value="formData.status" placeholder="请选择状态" mode="default" allowClear ><a-select-option :value="10">启用</a-select-option><a-select-option :value="20">禁用</a-select-option></a-select>
        </a-form-item>

      </div>

      <a-form-item :wrapper-col="{ offset: 3 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
        <a-button @click="onBack">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { pick,debounce } from 'lodash'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { update, detail } from '@/api/Grade'


defineOptions({
  inheritAttrs: false,
  name: 'grade.Update'
})

// 响应式状态
const loading = ref(false)
const detailData = ref({})
const id = ref('')
const tabKey = ref(1)
const formData = reactive({})
const route = useRoute()
const router = useRouter()



// 方法
const getDetail = () => {
  loading.value = true
  id.value = route.query.id
  detail({ id: id.value }).then(res => {
    detailData.value = res.data
    setFieldsValue()
  })
}

const handleTabsChange = (key) => {
  tabKey.value = key
}

const setFieldsValue = () => {
  const detail = detailData.value
  
  nextTick(() => {
    Object.assign(formData, pick(detail, ["name","icon_image","min_exp_number","benefit_desc","sort_number","is_default_switch","status"]))
    loading.value = false
  })
}
const onBack = () => {
  router.push('index')
}
const handleSubmit = async (e) => {
  e.preventDefault()
  loading.value = true
  try {
    const values = { ...formData, id: id.value }
    await update(values)
    message.success('更新成功')
    setTimeout(onBack, 1500)
  } catch (err) {
    loading.value = false
  }
}



// 生命周期
onMounted(() => {
  getDetail()

})
</script>
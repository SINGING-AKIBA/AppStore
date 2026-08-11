<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="ptype" label="undefined" >
          <a-select v-model:value="formData.ptype" placeholder="请选择undefined" mode="default" allowClear :filter-option="false" show-search @search="ptypeSearch"></a-select>
        </a-form-item>
        <a-form-item name="v0" label="undefined" >
          <a-input v-model:value="formData.v0" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v1" label="undefined" >
          <a-input v-model:value="formData.v1" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v2" label="undefined" >
          <a-input v-model:value="formData.v2" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v3" label="undefined" >
          <a-input v-model:value="formData.v3" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v4" label="undefined" >
          <a-input v-model:value="formData.v4" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v5" label="undefined" >
          <a-input v-model:value="formData.v5" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>
        <a-form-item name="v6" label="undefined" >
          <a-input v-model:value="formData.v6" placeholder="请输入undefined" type="text" max="1020" min="0"   />
        </a-form-item>

      </div>

      <a-form-item :wrapper-col="{ offset: 3 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">{{ $t('submit') }}</a-button>
        <a-button @click="onBack">{{ $t('back') }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { debounce, pick } from 'lodash'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { update, detail } from '@/api/Rules'


defineOptions({
  inheritAttrs: false,
  name: 'rules.Update'
})

// 响应式状态
const { t } = useI18n();
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
    Object.assign(formData, pick(detail, ["ptype","v0","v1","v2","v3","v4","v5","v6"]))
    loading.value = false
  })
}
const onBack = () => {
  router.push('index')
}
const handleSubmit = async (values) => {
  loading.value = true
  try {
    const values = { ...formData, id: id.value }
    await update(values)
    message.success(t('更新成功'))
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
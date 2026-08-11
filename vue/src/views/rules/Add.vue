<template>
  <a-card :loading="loading">
    <a-form
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 6 }"
      @finish="handleSubmit"
      :model="formData"
    >
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
import { debounce } from 'lodash'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { add } from '@/api/Rules'

defineOptions({
  inheritAttrs: false,
  name: 'rules.Add'
})
// 响应式状态
const { t } = useI18n();
const loading = ref(false)
const tabKey = ref(1)
const formData = reactive({
  
})
const router = useRouter()

const onBack = () => {
  router.push('index')
}
// 方法
const handleSubmit = async (values) => {
  loading.value = true;
  try {
    await add(values);
    message.success(t('添加成功'));
    setTimeout(onBack, 1500);
  } finally {
    loading.value = false;
  }
};
const handleTabsChange = (key) => {
  tabKey.value = key
}



// 生命周期
onMounted(() => {

})
</script>
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
        <a-tab-pane :key="2" tab="配置json数据"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="key" label="配置标题" :rules="[{required:true,message:'配置标题不能为空'}]">
          <a-input v-model:value="formData.key" placeholder="请输入配置标题" type="text" max="90" min="0"   />
        </a-form-item>
        <a-form-item name="describe" label="配置描述" >
          <a-input v-model:value="formData.describe" placeholder="请输入配置描述" type="text" max="765" min="0"   />
        </a-form-item>

      </div>
      <div class="tab-pane-content" v-show="tabKey==2">
        <a-form-item name="values" label="配置json数据" >
          <ueditor v-model="formData.values" />
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
import { add } from '@/api/Settings'

defineOptions({
  inheritAttrs: false,
  name: 'settings.Add'
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
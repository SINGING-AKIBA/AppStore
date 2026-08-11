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
        <a-form-item name="app_info_id" label="APP ID" :rules="[{required:true,message:'APP ID不能为空'}]">
          <a-select v-model:value="formData.app_info_id" placeholder="请选择APP ID" mode="default" allowClear :filter-option="false" show-search @search="appInfoSearch"><a-select-option v-for="item in appInfoOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="image" label="截图图片URL" :rules="[{required:true,message:'截图图片URL不能为空'}]">
          <select-image v-model="formData.image"  getUrl :defaultList="detailData && detailData.image ? [detailData.image] : []"/>
        </a-form-item>
        <a-form-item name="platform" label="适用平台" :rules="[{required:true,message:'适用平台不能为空'}]">
          <a-select v-model:value="formData.platform" placeholder="请选择适用平台" mode="default" allowClear ><a-select-option value="ios">iOS</a-select-option><a-select-option value="android">安卓</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort_order" label="排序（升序）" :rules="[{required:true,message:'排序（升序）不能为空'}]">
          <a-input-number v-model:value="formData.sort_order" placeholder="请输入排序（升序）"   min="0"  />
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
import { add } from '@/api/AppScreenshot'
import { select as appInfoSelectApi } from '@/api/AppInfo';

defineOptions({
  inheritAttrs: false,
  name: 'appscreenshot.Add'
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
const appInfoOptions = ref([]);
const appInfoQuery = reactive({});

function appInfoSelect(){
  appInfoSelectApi(appInfoQuery).then(res=>{
    appInfoOptions.value = res.data.data;
  })
};
const appInfoDebounce = debounce(appInfoSelect,800);
function appInfoSearch(value){
  appInfoQuery['search'] = value;
  appInfoDebounce();
};


// 生命周期
onMounted(() => {
appInfoSelect();
})
</script>
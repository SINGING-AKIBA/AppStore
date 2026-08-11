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
        <a-form-item name="version" label="版本号" :rules="[{required:true,message:'版本号不能为空'}]">
          <a-input v-model:value="formData.version" placeholder="请输入版本号" type="text" max="20" min="0"   />
        </a-form-item>
        <a-form-item name="version_code" label="内部版本号" >
          <a-input-number v-model:value="formData.version_code" placeholder="请输入内部版本号"   min="0"  />
        </a-form-item>
        <a-form-item name="size" label="安装包大小" >
          <a-input v-model:value="formData.size" placeholder="请输入安装包大小" type="text" max="20" min="0"   />
        </a-form-item>
        <a-form-item name="min_os_ios" label="iOS最低支持版本" >
          <a-input v-model:value="formData.min_os_ios" placeholder="请输入iOS最低支持版本" type="text" max="20" min="0"   />
        </a-form-item>
        <a-form-item name="min_os_android" label="Android最低支持版本" >
          <a-input v-model:value="formData.min_os_android" placeholder="请输入Android最低支持版本" type="text" max="20" min="0"   />
        </a-form-item>
        <a-form-item name="ios_url" label="iOS App Store下载链接" >
          <a-input v-model:value="formData.ios_url" placeholder="请输入iOS App Store下载链接" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="ios_appstore" label="iOS App Store ID" >
          <a-input v-model:value="formData.ios_appstore" placeholder="请输入iOS App Store ID" type="text" max="50" min="0"   />
        </a-form-item>
        <a-form-item name="android_url" label="Android APK下载链接" >
          <a-input v-model:value="formData.android_url" placeholder="请输入Android APK下载链接" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="changelog" label="更新日志/新特性说明" >
          <a-textarea v-model:value="formData.changelog" placeholder="请输入更新日志/新特性说明" />
        </a-form-item>
        <a-form-item name="platform" label="适用平台" :rules="[{required:true,message:'适用平台不能为空'}]">
          <a-select v-model:value="formData.platform" placeholder="请选择适用平台" mode="default" allowClear ><a-select-option value="ios">iOS</a-select-option><a-select-option value="android">安卓</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="force_update_switch" label="强制更新开关" :rules="[{required:true,message:'强制更新开关不能为空'}]">
          <a-select v-model:value="formData.force_update_switch" placeholder="请选择强制更新开关" mode="default" allowClear ><a-select-option :value="0">非强制</a-select-option><a-select-option :value="1">强制</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="status" label="状态" :rules="[{required:true,message:'状态不能为空'}]">
          <a-select v-model:value="formData.status" placeholder="请选择状态" mode="default" allowClear ><a-select-option :value="10">草稿</a-select-option><a-select-option :value="20">已发布</a-select-option><a-select-option :value="30">已回滚</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="publish_time" label="发布时间" >
          <a-date-picker v-model:value="formData.publish_time" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" />
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
import { add } from '@/api/AppVersion'
import { select as appInfoSelectApi } from '@/api/AppInfo';

defineOptions({
  inheritAttrs: false,
  name: 'appversion.Add'
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
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
        <a-form-item name="user_id" label="用户ID" :rules="[{required:true,message:'用户ID不能为空'}]">
          <a-select v-model:value="formData.user_id" placeholder="请选择用户ID" mode="default" allowClear :filter-option="false" show-search @search="userSearch"><a-select-option v-for="item in userOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="oauth_type" label="第三方名称" :rules="[{required:true,message:'第三方名称不能为空'}]">
          <a-select v-model:value="formData.oauth_type" placeholder="请选择第三方名称" mode="default" allowClear :filter-option="false" show-search @search="oauthTypeSearch"></a-select>
        </a-form-item>
        <a-form-item name="openid" label="第三方用户唯一标识" :rules="[{required:true,message:'第三方用户唯一标识不能为空'}]">
          <a-input v-model:value="formData.openid" placeholder="请输入第三方用户唯一标识" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="unionid" label="微信unionID" :rules="[{required:true,message:'微信unionID不能为空'}]">
          <a-input v-model:value="formData.unionid" placeholder="请输入微信unionID" type="text" max="765" min="0"   />
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
import { add } from '@/api/Oauth'
import { select as userSelectApi } from '@/api/User';

defineOptions({
  inheritAttrs: false,
  name: 'oauth.Add'
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
const userOptions = ref([]);
const userQuery = reactive({});

function userSelect(){
  userSelectApi(userQuery).then(res=>{
    userOptions.value = res.data.data;
  })
};
const userDebounce = debounce(userSelect,800);
function userSearch(value){
  userQuery['search'] = value;
  userDebounce();
};


// 生命周期
onMounted(() => {
userSelect();
})
</script>
<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
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
import { debounce, pick } from 'lodash'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { update, detail } from '@/api/Oauth'
import { select as userSelectApi } from '@/api/User';


defineOptions({
  inheritAttrs: false,
  name: 'oauth.Update'
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

const userOptions = ref([]);
const userQuery = reactive({});


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
    Object.assign(formData, pick(detail, ["user_id","oauth_type","openid","unionid"]))
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
  getDetail()
userSelect();
})
</script>
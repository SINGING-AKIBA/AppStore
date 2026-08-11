<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>
        <a-tab-pane :key="2" tab="短信内容"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="mobile" label="手机号" :rules="[{required:true,message:'手机号不能为空'}]">
          <a-input v-model:value="formData.mobile" placeholder="请输入手机号" type="text" max="20" min="0"   />
        </a-form-item>
        <a-form-item name="type" label="短信类型" :rules="[{required:true,message:'短信类型不能为空'}]">
          <a-select v-model:value="formData.type" placeholder="请选择短信类型" mode="default" allowClear ><a-select-option :value="1">验证码</a-select-option><a-select-option :value="2">通知短信</a-select-option><a-select-option :value="3">营销短信</a-select-option><a-select-option :value="4">系统消息</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="status" label="发送状态" :rules="[{required:true,message:'发送状态不能为空'}]">
          <a-select v-model:value="formData.status" placeholder="请选择发送状态" mode="default" allowClear ><a-select-option :value="10">待发送</a-select-option><a-select-option :value="20">发送成功</a-select-option><a-select-option :value="30">发送失败</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="success_switch" label="是否成功" :rules="[{required:true,message:'是否成功不能为空'}]">
          <a-select v-model:value="formData.success_switch" placeholder="请选择是否成功" mode="default" allowClear ><a-select-option :value="0">失败</a-select-option><a-select-option :value="1">成功</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="templateId" label="短信模板ID" >
          <a-input v-model:value="formData.templateId" placeholder="请输入短信模板ID" type="text" max="100" min="0"   />
        </a-form-item>
        <a-form-item name="result_textarea" label="返回结果信息" >
          <a-textarea v-model:value="formData.result_textarea" placeholder="请输入返回结果信息" />
        </a-form-item>
        <a-form-item name="user_id" label="用户ID" >
          <a-select v-model:value="formData.user_id" placeholder="请选择用户ID" mode="default" allowClear :filter-option="false" show-search @search="userSearch"><a-select-option v-for="item in userOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="platform" label="短信平台" >
          <a-input-number v-model:value="formData.platform" placeholder="请输入短信平台"   min="0"  />
        </a-form-item>

      </div>
      <div class="tab-pane-content" v-show="tabKey==2">
        <a-form-item name="content" label="短信内容" >
          <ueditor v-model="formData.content" />
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
import { update, detail } from '@/api/SmsRecords'
import { select as userSelectApi } from '@/api/User';


defineOptions({
  inheritAttrs: false,
  name: 'smsrecords.Update'
})

// 响应式状态
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
    Object.assign(formData, pick(detail, ["mobile","content","type","status","success_switch","templateId","result_textarea","user_id","platform"]))
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

function userSelect(){
  userSelectApi(userQuery).then(res=>{
    userOptions.value = res.data.data;
  })
};
function userSearch(value){
  userQuery['search'] = value;
  debounce(userSelect(),800);
};


// 生命周期
onMounted(() => {
  getDetail()
userSelect();
})
</script>
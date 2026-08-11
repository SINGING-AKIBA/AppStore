<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="username" label="用户名" :rules="[{required:true,message:'用户名不能为空'}]">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" type="text" max="50" min="0"   />
        </a-form-item>
        <a-form-item name="password" label="登录密码" :rules="[{required:true,message:'登录密码不能为空'}]">
          <a-input v-model:value="formData.password" placeholder="请输入登录密码" type="text" max="255" min="0"   />
        </a-form-item>
        <a-form-item name="real_name" label="姓名" :rules="[{required:true,message:'姓名不能为空'}]">
          <a-input v-model:value="formData.real_name" placeholder="请输入姓名" type="text" max="50" min="0"   />
        </a-form-item>
        <a-form-item name="is_super" label="是否为超级管理员1是0不是" :rules="[{required:true,message:'是否为超级管理员1是0不是不能为空'}]">
          <a-input v-model:value="formData.is_super" placeholder="请输入是否为超级管理员1是0不是" type="text"  min="0"   />
        </a-form-item>
        <a-form-item name="user_id" label="undefined" >
          <a-select v-model:value="formData.user_id" placeholder="请选择undefined" mode="default" allowClear :filter-option="false" show-search @search="userSearch"><a-select-option value="0">默认值</a-select-option><a-select-option v-for="item in userOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort" label="排序(数字越小越靠前)" >
          <a-input-number v-model:value="formData.sort" placeholder="请输入排序(数字越小越靠前)"   min="0"  />
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
import { update, detail } from '@/api/Admin'
import { select as userSelectApi } from '@/api/User';


defineOptions({
  inheritAttrs: false,
  name: 'admin.Update'
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
    Object.assign(formData, pick(detail, ["username","password","real_name","is_super","user_id","sort"]))
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
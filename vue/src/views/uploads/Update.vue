<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="group_id" label="文件分组ID" :rules="[{required:true,message:'文件分组ID不能为空'}]">
          <a-select v-model:value="formData.group_id" placeholder="请选择文件分组ID" mode="default" allowClear :filter-option="false" show-search @search="groupSearch"><a-select-option value="0">默认值</a-select-option><a-select-option v-for="item in groupOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="channel" label="上传来源(10总后台,20商户后台,30客户端)" :rules="[{required:true,message:'上传来源(10总后台,20商户后台,30客户端)不能为空'}]">
          <a-input v-model:value="formData.channel" placeholder="请输入上传来源(10总后台,20商户后台,30客户端)" type="text"  min="0"   />
        </a-form-item>
        <a-form-item name="storage" label="存储方式" :rules="[{required:true,message:'存储方式不能为空'}]">
          <a-input v-model:value="formData.storage" placeholder="请输入存储方式" type="text" max="60" min="0"   />
        </a-form-item>
        <a-form-item name="domain" label="存储域名" :rules="[{required:true,message:'存储域名不能为空'}]">
          <a-input v-model:value="formData.domain" placeholder="请输入存储域名" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="type" label="文件类型(10图片 20附件 30视频)" :rules="[{required:true,message:'文件类型(10图片 20附件 30视频)不能为空'}]">
          <a-select v-model:value="formData.type" placeholder="请选择文件类型(10图片 20附件 30视频)" mode="default" allowClear :filter-option="false" show-search @search="typeSearch"></a-select>
        </a-form-item>
        <a-form-item name="name" label="文件名称" :rules="[{required:true,message:'文件名称不能为空'}]">
          <a-input v-model:value="formData.name" placeholder="请输入文件名称" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="path" label="文件路径" :rules="[{required:true,message:'文件路径不能为空'}]">
          <a-input v-model:value="formData.path" placeholder="请输入文件路径" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="size" label="文件大小(字节)" :rules="[{required:true,message:'文件大小(字节)不能为空'}]">
          <a-input-number v-model:value="formData.size" placeholder="请输入文件大小(字节)"   min="0"  />
        </a-form-item>
        <a-form-item name="ext" label="文件扩展名" :rules="[{required:true,message:'文件扩展名不能为空'}]">
          <a-input v-model:value="formData.ext" placeholder="请输入文件扩展名" type="text" max="60" min="0"   />
        </a-form-item>
        <a-form-item name="cover" label="文件封面" :rules="[{required:true,message:'文件封面不能为空'}]">
          <a-input v-model:value="formData.cover" placeholder="请输入文件封面" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="user_id" label="用户ID" :rules="[{required:true,message:'用户ID不能为空'}]">
          <a-select v-model:value="formData.user_id" placeholder="请选择用户ID" mode="default" allowClear :filter-option="false" show-search @search="userSearch"><a-select-option value="0">默认值</a-select-option><a-select-option v-for="item in userOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="is_recycle" label="是否在回收站(0不是10是）" :rules="[{required:true,message:'是否在回收站(0不是10是）不能为空'}]">
          <a-input v-model:value="formData.is_recycle" placeholder="请输入是否在回收站(0不是10是）" type="text"  min="0"   />
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
import { update, detail } from '@/api/Uploads'
import { select as groupSelectApi } from '@/api/Group';
import { select as userSelectApi } from '@/api/User';


defineOptions({
  inheritAttrs: false,
  name: 'uploads.Update'
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

const groupOptions = ref([]);
const groupQuery = reactive({});
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
    Object.assign(formData, pick(detail, ["group_id","channel","storage","domain","type","name","path","size","ext","cover","user_id","is_recycle"]))
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

function groupSelect(){
  groupSelectApi(groupQuery).then(res=>{
    groupOptions.value = res.data.data;
  })
};
const groupDebounce = debounce(groupSelect,800);
function groupSearch(value){
  groupQuery['search'] = value;
  groupDebounce();
};
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
groupSelect();userSelect();
})
</script>
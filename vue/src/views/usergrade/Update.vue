<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="user_id" label="用户" :rules="[{required:true,message:'用户不能为空'}]">
          <a-select v-model:value="formData.user_id" placeholder="请选择用户" mode="default" allowClear :filter-option="false" show-search @search="userSearch"><a-select-option v-for="item in userOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="grade_id" label="会员等级" :rules="[{required:true,message:'会员等级不能为空'}]">
          <a-select v-model:value="formData.grade_id" placeholder="请选择会员等级" mode="default" allowClear :filter-option="false" show-search @search="gradeSearch"><a-select-option v-for="item in gradeOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="start_time" label="生效时间" :rules="[{required:true,message:'生效时间不能为空'}]">
          <a-date-picker v-model:value="formData.start_time" format="YYYY-MM-DD" valueFormat="X" />
        </a-form-item>
        <a-form-item name="end_time" label="结束时间" :rules="[{required:true,message:'结束时间不能为空'}]">
          <a-date-picker v-model:value="formData.end_time" format="YYYY-MM-DD" valueFormat="X" />
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
import { update, detail } from '@/api/UserGrade'
import { select as userSelectApi } from '@/api/User';
import { select as gradeSelectApi } from '@/api/Grade';


defineOptions({
  inheritAttrs: false,
  name: 'usergrade.Update'
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
const gradeOptions = ref([]);
const gradeQuery = reactive({});


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
    Object.assign(formData, pick(detail, ["user_id","grade_id","start_time","end_time"]))
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
function gradeSelect(){
  gradeSelectApi(gradeQuery).then(res=>{
    gradeOptions.value = res.data.data;
  })
};
function gradeSearch(value){
  gradeQuery['search'] = value;
  debounce(gradeSelect(),800);
};


// 生命周期
onMounted(() => {
  getDetail()
userSelect();gradeSelect();
})
</script>
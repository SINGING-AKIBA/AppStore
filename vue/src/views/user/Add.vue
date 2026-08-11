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
        <a-form-item name="nick_name" label="用户昵称" :rules="[{required:true,message:'用户昵称不能为空'}]">
          <a-input v-model:value="formData.nick_name" placeholder="请输入用户昵称" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="gender" label="性别" :rules="[{required:true,message:'性别不能为空'}]">
          <a-select v-model:value="formData.gender" placeholder="请选择性别" mode="default" allowClear ><a-select-option :value="0">保密</a-select-option><a-select-option :value="1">男</a-select-option><a-select-option :value="2">女</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="platform" label="注册来源" :rules="[{required:true,message:'注册来源不能为空'}]">
          <a-select v-model:value="formData.platform" placeholder="请选择注册来源" mode="default" allowClear ><a-select-option value="H5">web</a-select-option><a-select-option value="APP">app</a-select-option><a-select-option value="MP-WEIXIN">微信小程序</a-select-option><a-select-option value="MP-ALIPAY">支付宝小程序</a-select-option><a-select-option value="MP-TOUTIAO">抖音小程序</a-select-option><a-select-option value="MP-QQ">QQ小程序</a-select-option><a-select-option value="MP-KUAISHOU">快手小程序</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="avatar_img" label="头像图片ID" >
          <select-image v-model="formData.avatar_img"   :defaultList="detailData && detailData.avatarImgList ? [detailData.avatarImgList] : []"/>
        </a-form-item>
        <a-form-item name="country" label="国家" >
          <a-input v-model:value="formData.country" placeholder="请输入国家" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="province" label="省份" >
          <a-input v-model:value="formData.province" placeholder="请输入省份" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="city" label="城市" >
          <a-input v-model:value="formData.city" placeholder="请输入城市" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="balance" label="用户可用余额" >
          <a-input v-model:value="formData.balance" placeholder="请输入用户可用余额" type="text"  min="0"   />
        </a-form-item>
        <a-form-item name="points" label="用户积分" >
          <a-input-number v-model:value="formData.points" placeholder="请输入用户积分"   min="0"  />
        </a-form-item>
        <a-form-item name="mobile" label="用户手机号" >
          <a-input v-model:value="formData.mobile" placeholder="请输入用户手机号" type="text" max="60" min="0"   />
        </a-form-item>
        <a-form-item name="real_name" label="真实姓名" >
          <a-input v-model:value="formData.real_name" placeholder="请输入真实姓名" type="text" max="80" min="0"   />
        </a-form-item>
        <a-form-item name="grade_id" label="会员等级ID" >
          <a-select v-model:value="formData.grade_id" placeholder="请选择会员等级ID" mode="default" allowClear :filter-option="false" show-search @search="gradeSearch"><a-select-option v-for="item in gradeOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="last_login_time" label="最后登录时间" >
          <a-date-picker v-model:value="formData.last_login_time" format="YYYY-MM-DD" valueFormat="X" />
        </a-form-item>
        <a-form-item name="last_login_ip" label="最后登录IP" >
          <a-input v-model:value="formData.last_login_ip" placeholder="请输入最后登录IP" type="text" max="120" min="0"   />
        </a-form-item>
        <a-form-item name="status" label="用户状态" >
          <a-select v-model:value="formData.status" placeholder="请选择用户状态" mode="default" allowClear ><a-select-option :value="10">正常</a-select-option><a-select-option :value="20">拉黑</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="message" label="拉黑原因" >
          <a-textarea v-model:value="formData.message" placeholder="请输入拉黑原因" />
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
import { debounce } from 'lodash'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { add } from '@/api/User'
import { select as gradeSelectApi } from '@/api/Grade';

defineOptions({
  inheritAttrs: false,
  name: 'user.Add'
})
// 响应式状态
const loading = ref(false)
const tabKey = ref(1)
const formData = reactive({
  
})
const router = useRouter()

const onBack = () => {
  router.push('index')
}
// 方法
const handleSubmit = (values) => {
  loading.value = true;
  try {
    add(values).then(res => {
      message.success('添加成功');
      setTimeout(onBack, 1500);
    })
  }finally{
    loading.value = false;
  }
};
const handleTabsChange = (key) => {
  tabKey.value = key
}
const gradeOptions = ref([]);
const gradeQuery = reactive({});

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
gradeSelect();
})
</script>
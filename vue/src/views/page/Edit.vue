<template>
  <a-row class="page-wrapper">
    <a-col class="col" :span="8">
      <components @handleClick="handleClick" />
    </a-col>
    <a-col class="col" :span="8">
      <phone v-if="!isLoading" v-model="data" :selectIndex="selectIndex" @onEditor="onEditor" @deleteItem="deleteItem"/>
    </a-col>
    <a-col class="col" :span="8">
      <editor v-if="!isLoading" v-model="data[selectIndex]" />
    </a-col>
    <div class="footer">
      <a-button type="primary" :loading="isLoading" @click="formSubmit">保存</a-button>
    </div>
  </a-row>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import components from "./components.vue";
import phone from './phone.vue';
import editor from './Editor.vue';
import defaultData from './data.js';
import _ from 'lodash';
import { edit } from "@/api/Page";
import { message } from 'ant-design-vue';

// 初始化数据
const data = ref([]);
const isLoading = ref(false);
const selectIndex = ref(0);
const id = ref('');

// 点击事件处理函数
const handleClick = (type) => {
  const item = _.cloneDeep(defaultData[type]);
  data.value.push(item);
  onEditor(data.value.length - 1);
};

// 编辑器事件处理函数
const onEditor = (index) => {
  selectIndex.value = index;
};

// 删除项目
const deleteItem = (index) => {
  data.value.splice(index, 1);
  if (selectIndex.value >= index) {
    selectIndex.value--;
  }
};

// 表单提交
const formSubmit = () => {
  isLoading.value = true;
  
  try{
    edit({ data: data.value, id:id.value }).then(res => {
      message.success('保存成功');
      router.push('/page/index');
    })
  }finally{()=>{
    isLoading.value = false;
  }}
};

// 使用路由
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  const record = sessionStorage.getItem('page_edit_record');
  if (!record) {
    message.error('数据异常请返回重新点击编辑');
    return;
  }
  const parsedData = JSON.parse(record);
  id.value = parsedData.id;
  data.value = parsedData.data;
});
</script>

<style lang="less" scoped>
.page-wrapper{
  .col{
      display:flex;
      justify-content: center ;
  }
  .footer{
      width: 90%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 0px;
      background: #ffffff;
  }
}
</style>
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
        <a-form-item name="name" label="名称" :rules="[{required:true,message:'名称不能为空'}]">
          <a-input v-model:value="formData.name" placeholder="请输入名称" type="text" max="90" min="0"   />
        </a-form-item>
        <a-form-item name="pid" label="上级ID" :rules="[{required:true,message:'上级ID不能为空'}]">
          <a-select v-model:value="formData.pid" placeholder="请选择上级ID" mode="default" allowClear :filter-option="false" show-search @search="pidSearch"><a-select-option value="0">默认值</a-select-option><a-select-option v-for="item in CategoryOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort" label="排序" :rules="[{required:true,message:'排序不能为空'}]">
          <a-input-number v-model:value="formData.sort" placeholder="请输入排序"   min="0"  />
        </a-form-item>
        <a-form-item name="icon" label="图标" >
          <select-image v-model="formData.icon"   :defaultList="detailData && detailData.iconList ? detailData.iconList : []"/>
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
import { add } from '@/api/Category'
import { select as CategorySelectApi } from '@/api/Category';

defineOptions({
  inheritAttrs: false,
  name: 'category.Add'
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
const CategoryOptions = ref([]);
const CategoryQuery = reactive({});

function CategorySelect(){
  CategorySelectApi(CategoryQuery).then(res=>{
    CategoryOptions.value = res.data.data;
  })
};
function pidSearch(value){
  CategoryQuery['search'] = value;
  debounce(CategorySelect(),800);
};


// 生命周期
onMounted(() => {
CategorySelect();
})
</script>
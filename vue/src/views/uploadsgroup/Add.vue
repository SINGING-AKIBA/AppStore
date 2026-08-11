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
        <a-form-item name="name" label="分组名称" :rules="[{required:true,message:'分组名称不能为空'}]">
          <a-input v-model:value="formData.name" placeholder="请输入分组名称" type="text" max="90" min="0"   />
        </a-form-item>
        <a-form-item name="pid" label="上级分组ID" :rules="[{required:true,message:'上级分组ID不能为空'}]">
          <a-select v-model:value="formData.pid" placeholder="请选择上级分组ID" mode="default" allowClear :filter-option="false" show-search @search="pidSearch"><a-select-option v-for="item in UploadsGroupOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort" label="排序(数字越小越靠前)" :rules="[{required:true,message:'排序(数字越小越靠前)不能为空'}]">
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
import { debounce } from 'lodash'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { add } from '@/api/UploadsGroup'
import { select as UploadsGroupSelectApi } from '@/api/UploadsGroup';

defineOptions({
  inheritAttrs: false,
  name: 'uploadsgroup.Add'
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
const UploadsGroupOptions = ref([]);
const UploadsGroupQuery = reactive({});

function UploadsGroupSelect(){
  UploadsGroupSelectApi(UploadsGroupQuery).then(res=>{
    UploadsGroupOptions.value = res.data.data;
  })
};
const UploadsGroupDebounce = debounce(UploadsGroupSelect,800);
function pidSearch(value){
  UploadsGroupQuery['search'] = value;
  UploadsGroupDebounce();
};


// 生命周期
onMounted(() => {
UploadsGroupSelect();
})
</script>
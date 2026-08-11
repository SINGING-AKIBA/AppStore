<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="type" label="类型" :rules="[{required:true,message:'类型不能为空'}]">
          <a-select v-model:value="formData.type" placeholder="请选择类型" mode="default" allowClear :filter-option="false" show-search @search="typeSearch"></a-select>
        </a-form-item>
        <a-form-item name="pid" label="父级ID" :rules="[{required:true,message:'父级ID不能为空'}]">
          <a-select v-model:value="formData.pid" placeholder="请选择父级ID" mode="default" allowClear :filter-option="false" show-search @search="pidSearch"><a-select-option v-for="item in MenuOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="title" label="名称" :rules="[{required:true,message:'名称不能为空'}]">
          <a-input v-model:value="formData.title" placeholder="请输入名称" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="path" label="路径地址" :rules="[{required:true,message:'路径地址不能为空'}]">
          <a-input v-model:value="formData.path" placeholder="请输入路径地址" type="text" max="300" min="0"   />
        </a-form-item>
        <a-form-item name="icon" label="图标" :rules="[{required:true,message:'图标不能为空'}]">
          <select-image v-model="formData.icon"  getUrl :defaultList="detailData && detailData.icon ? [detailData.icon] : []"/>
        </a-form-item>
        <a-form-item name="weigh" label="排序" :rules="[{required:true,message:'排序不能为空'}]">
          <a-input-number v-model:value="formData.weigh" placeholder="请输入排序"   min="0"  />
        </a-form-item>
        <a-form-item name="status" label="状态" :rules="[{required:true,message:'状态不能为空'}]">
          <a-select v-model:value="formData.status" placeholder="请选择状态" mode="default" allowClear ><a-select-option :value="10">显示</a-select-option><a-select-option :value="20">隐藏</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="target" label="打开方式" :rules="[{required:true,message:'打开方式不能为空'}]">
          <a-select v-model:value="formData.target" placeholder="请选择打开方式" mode="default" allowClear ><a-select-option :value="10">_self</a-select-option><a-select-option :value="20">_blank</a-select-option><a-select-option :value="30">_top</a-select-option><a-select-option :value="40">_parent</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="show" label="10显示20隐藏" :rules="[{required:true,message:'10显示20隐藏不能为空'}]">
          <a-input v-model:value="formData.show" placeholder="请输入10显示20隐藏" type="text"  min="0"   />
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
import { update, detail } from '@/api/Menu'
import { select as MenuSelectApi } from '@/api/Menu';


defineOptions({
  inheritAttrs: false,
  name: 'menu.Update'
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

const MenuOptions = ref([]);
const MenuQuery = reactive({});


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
    Object.assign(formData, pick(detail, ["type","pid","title","path","icon","weigh","status","target","show"]))
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

function MenuSelect(){
  MenuSelectApi(MenuQuery).then(res=>{
    MenuOptions.value = res.data.data;
  })
};
const MenuDebounce = debounce(MenuSelect,800);
function pidSearch(value){
  MenuQuery['search'] = value;
  MenuDebounce();
};


// 生命周期
onMounted(() => {
  getDetail()
MenuSelect();
})
</script>
<template>
  <a-card :loading="loading">
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @finish="handleSubmit" :model="formData">
      <a-tabs v-model:activeKey="tabKey" type="card" @change="handleTabsChange">
        <a-tab-pane :key="1" tab="基本信息"></a-tab-pane>

      </a-tabs>
      <div class="tab-pane-content" v-show="tabKey==1">
        <a-form-item name="name" label="应用名称" :rules="[{required:true,message:'应用名称不能为空'}]">
          <a-input v-model:value="formData.name" placeholder="请输入应用名称" type="text" max="200" min="0"   />
        </a-form-item>
        <a-form-item name="app_key" label="应用唯一标识键" :rules="[{required:true,message:'应用唯一标识键不能为空'}]">
          <a-input v-model:value="formData.app_key" placeholder="请输入应用唯一标识键" type="text" max="100" min="0"   />
        </a-form-item>
        <a-form-item name="subtitle" label="副标题/标语" >
          <a-input v-model:value="formData.subtitle" placeholder="请输入副标题/标语" type="text" max="300" min="0"   />
        </a-form-item>
        <a-form-item name="icon" label="应用图标URL" >
          <select-image v-model="formData.icon"  getUrl :defaultList="detailData && detailData.icon ? [detailData.icon] : []"/>
        </a-form-item>
        <a-form-item name="company" label="开发商/公司名称" >
          <a-input v-model:value="formData.company" placeholder="请输入开发商/公司名称" type="text" max="200" min="0"   />
        </a-form-item>
        <a-form-item name="description" label="应用描述" >
          <a-textarea v-model:value="formData.description" placeholder="请输入应用描述" />
        </a-form-item>
        <a-form-item name="category" label="分类" >
          <a-input v-model:value="formData.category" placeholder="请输入分类" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="age_rating" label="年龄评级" >
          <a-select v-model:value="formData.age_rating" placeholder="请选择年龄评级" mode="default" allowClear ><a-select-option value="4+">4+</a-select-option><a-select-option value="9+">9+</a-select-option><a-select-option value="12+">12+</a-select-option><a-select-option value="17+">17+</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="rating" label="用户评分（0.0-5.0）" :rules="[{required:true,message:'用户评分（0.0-5.0）不能为空'}]">
          <a-input v-model:value="formData.rating" placeholder="请输入用户评分（0.0-5.0）" type="text"  min="0"   />
        </a-form-item>
        <a-form-item name="rating_count" label="评分数" :rules="[{required:true,message:'评分数不能为空'}]">
          <a-input-number v-model:value="formData.rating_count" placeholder="请输入评分数"   min="0"  />
        </a-form-item>
        <a-form-item name="copyright" label="版权信息" >
          <a-input v-model:value="formData.copyright" placeholder="请输入版权信息" type="text" max="200" min="0"   />
        </a-form-item>
        <a-form-item name="privacy_url" label="隐私政策链接" >
          <a-input v-model:value="formData.privacy_url" placeholder="请输入隐私政策链接" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="terms_url" label="服务条款链接" >
          <a-input v-model:value="formData.terms_url" placeholder="请输入服务条款链接" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="support_url" label="联系我们/技术支持链接" >
          <a-input v-model:value="formData.support_url" placeholder="请输入联系我们/技术支持链接" type="text" max="500" min="0"   />
        </a-form-item>
        <a-form-item name="status" label="状态" :rules="[{required:true,message:'状态不能为空'}]">
          <a-select v-model:value="formData.status" placeholder="请选择状态" mode="default" allowClear ><a-select-option :value="10">上架</a-select-option><a-select-option :value="20">下架</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort_order" label="排序权重" :rules="[{required:true,message:'排序权重不能为空'}]">
          <a-input-number v-model:value="formData.sort_order" placeholder="请输入排序权重"   min="0"  />
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
import { update, detail } from '@/api/AppInfo'


defineOptions({
  inheritAttrs: false,
  name: 'appinfo.Update'
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
    Object.assign(formData, pick(detail, ["name","app_key","subtitle","icon","company","description","category","age_rating","rating","rating_count","copyright","privacy_url","terms_url","support_url","status","sort_order"]))
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



// 生命周期
onMounted(() => {
  getDetail()

})
</script>
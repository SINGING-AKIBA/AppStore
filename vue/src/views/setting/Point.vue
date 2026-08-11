<template>
  <a-card>
    <a-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      @finish="handleSubmit"
      v-bind="formLayout"
    >
      <!-- 规则说明 -->
      <a-divider orientation="left">规则说明</a-divider>
      <a-form-item name="rules" label="规则说明">
        <ueditor v-model="form.rules" />
      </a-form-item>

      <!-- 宫格海报 -->
      <a-divider orientation="left">宫格海报</a-divider>
      <a-row :gutter="16">
        <!-- 左边（高） -->
        <a-col :span="12">
          <a-card title="海报 1" size="small" class="poster-tall">
            <a-form-item label="海报图片" :name="['posters', 0, 'image']">
              <select-image v-model="form.posters[0].image" getUrl :defaultList="previewLists[0]" />
            </a-form-item>
            <a-form-item label="跳转路径" :name="['posters', 0, 'link']">
              <a-input v-model:value="form.posters[0].link" placeholder="请输入跳转链接或路径" />
            </a-form-item>
          </a-card>
        </a-col>
        <!-- 右边上 + 下 -->
        <a-col :span="12">
          <div class="right-stack">
            <a-card title="海报 2" size="small">
              <a-form-item label="海报图片" :name="['posters', 1, 'image']">
                <select-image v-model="form.posters[1].image" getUrl :defaultList="previewLists[1]" />
              </a-form-item>
              <a-form-item label="跳转路径" :name="['posters', 1, 'link']">
                <a-input v-model:value="form.posters[1].link" placeholder="请输入跳转链接或路径" />
              </a-form-item>
            </a-card>
            <a-card title="海报 3" size="small" style="margin-top: 16px;">
              <a-form-item label="海报图片" :name="['posters', 2, 'image']">
                <select-image v-model="form.posters[2].image" getUrl :defaultList="previewLists[2]" />
              </a-form-item>
              <a-form-item label="跳转路径" :name="['posters', 2, 'link']">
                <a-input v-model:value="form.posters[2].link" placeholder="请输入跳转链接或路径" />
              </a-form-item>
            </a-card>
          </div>
        </a-col>
      </a-row>

      <!-- 核心海报 -->
      <a-divider orientation="left" style="margin-top: 24px;">核心海报</a-divider>
      <a-row>
        <a-col :span="12">
          <a-card title="海报 4" size="small">
            <a-form-item label="海报图片" :name="['posters', 3, 'image']">
              <select-image v-model="form.posters[3].image" getUrl :defaultList="previewLists[3]" />
            </a-form-item>
            <a-form-item label="跳转路径" :name="['posters', 3, 'link']">
              <a-input v-model:value="form.posters[3].link" placeholder="请输入跳转链接或路径" />
            </a-form-item>
          </a-card>
        </a-col>
      </a-row>

      <!-- 提交按钮 -->
      <a-form-item :wrapperCol="{ offset: 4 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getSettings, setSettings } from '@/api/Setting';

const key = 'point_ad_setting';

defineOptions({
  inheritAttrs: false,
  name: 'setting.Point',
});

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

// Form model — posters 作为数值数组
const form = reactive({
  rules: '',
  posters: [
    { image: '', link: '' },
    { image: '', link: '' },
    { image: '', link: '' },
    { image: '', link: '' },
  ],
});

// 验证规则
const rules = {};

// 加载状态
const loading = ref(false);

// SelectImage 预览列表
const previewLists = reactive([[],[],[],[]]);

// 加载设置
onMounted(async () => {
  try {
    const res = await getSettings({ key });
    const data = res.data;
    form.rules = data.rules || '';

    if (Array.isArray(data.posters)) {
      data.posters.forEach((p, i) => {
        if (form.posters[i]) {
          form.posters[i].image = p.image || '';
          form.posters[i].link = p.link || '';
        }
        if (p.image) previewLists[i] = [p.image];
      });
    }
  } catch (error) {
    console.error('获取设置失败:', error);
  }
});

// 提交
const handleSubmit = async (values) => {
  try {
    loading.value = true;
    await setSettings({ data: values, key });
    message.success('保存成功');
  } catch (error) {
    if (error !== 'cancel') {
      message.error('保存失败，请重试。');
      console.error('保存设置失败:', error);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.poster-tall {
  height: 100%;
}
.poster-tall :deep(.ant-card-body) {
  min-height: 280px;
}
.right-stack {
  display: flex;
  flex-direction: column;
}
</style>
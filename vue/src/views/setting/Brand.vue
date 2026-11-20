<template>
  <a-card class="brand-settings-card">
    <a-form
      :model="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 12 }"
      @finish="handleSubmit"
    >
      <a-divider orientation="left">移动端品牌信息</a-divider>

      <a-form-item label="头部预览">
        <div class="brand-preview">
          <div class="brand-preview-logo">
            <img v-if="form.logo" :src="form.logo" alt="App Store Logo" />
            <span v-else>LOGO</span>
          </div>
          <div class="brand-preview-copy">
            <strong>{{ form.title || 'APP STORE' }}</strong>
            <span>{{ form.subtitle || 'CURATED APPS' }}</span>
          </div>
        </div>
      </a-form-item>

      <a-form-item label="Logo 图片" name="logo">
        <div class="logo-editor">
          <div class="logo-actions">
            <a-button type="primary" @click="openLogoPicker">从素材库选择</a-button>
            <a-button v-if="form.logo" danger @click="form.logo = ''">清除图片</a-button>
          </div>
          <a-input
            v-model:value="form.logo"
            allow-clear
            placeholder="也可以直接填写图片 URL"
          />
          <div class="field-hint">支持从素材库上传或选择图片，也可以粘贴 HTTPS 图片地址</div>
        </div>
      </a-form-item>

      <a-form-item label="标题" name="title">
        <a-input
          v-model:value="form.title"
          :maxlength="40"
          show-count
          placeholder="例如：APP STORE"
        />
      </a-form-item>

      <a-form-item label="副标题" name="subtitle">
        <a-input
          v-model:value="form.subtitle"
          :maxlength="60"
          show-count
          placeholder="例如：CURATED APPS"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">
          保存设置
        </a-button>
      </a-form-item>
    </a-form>

    <FilesModal
      ref="logoPicker"
      :multiple="false"
      :maxNum="1"
      :selectedNum="0"
      :type="10"
      title="选择品牌 Logo"
      @handleSubmit="handleLogoSelected"
    />
  </a-card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { getSettings, setSettings } from '@/api/Setting';

defineOptions({
  inheritAttrs: false,
  name: 'setting.Brand'
});

const form = reactive({
  logo: '',
  title: 'APP STORE',
  subtitle: 'CURATED APPS',
});
const loading = ref(false);
const logoPicker = ref(null);

function extractLegacyLogo(value) {
  if (typeof value === 'string') {
    const imageSource = value.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    return (imageSource || value.replace(/<[^>]*>/g, '').trim()).trim();
  }
  if (value && typeof value === 'object') {
    return String(value.logo || value.url || value.src || '').trim();
  }
  return '';
}

async function loadBranding() {
  try {
    const [brandingResponse, legacyLogoResponse] = await Promise.all([
      getSettings({ key: 'app_store_branding' }),
      getSettings({ key: 'app_store_logo' }),
    ]);
    const branding = brandingResponse?.data && typeof brandingResponse.data === 'object'
      ? brandingResponse.data
      : {};

    form.logo = String(branding.logo || extractLegacyLogo(legacyLogoResponse?.data)).trim();
    form.title = String(branding.title || 'APP STORE').trim() || 'APP STORE';
    form.subtitle = String(branding.subtitle || 'CURATED APPS').trim() || 'CURATED APPS';
  } catch (error) {
    console.error('加载品牌设置失败:', error);
    message.error('加载品牌设置失败');
  }
}

function openLogoPicker() {
  logoPicker.value?.show();
}

function handleLogoSelected(files) {
  const selected = Array.isArray(files) ? files[0] : null;
  if (selected?.url) {
    form.logo = selected.url;
  }
}

async function handleSubmit() {
  loading.value = true;
  const values = {
    logo: form.logo.trim(),
    title: form.title.trim() || 'APP STORE',
    subtitle: form.subtitle.trim() || 'CURATED APPS',
  };

  try {
    await setSettings({ key: 'app_store_branding', data: values });
    Object.assign(form, values);
    message.success('品牌设置保存成功，移动端下次加载时生效');
  } catch (error) {
    console.error('保存品牌设置失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

onMounted(loadBranding);
</script>

<style scoped>
.brand-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  width: min(100%, 440px);
  padding: 16px 18px;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  background: #f7f9fc;
}

.brand-preview-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  overflow: hidden;
  border-radius: 12px;
  background: #e8eef7;
  color: #6b7f99;
  font-size: 11px;
  font-weight: 700;
}

.brand-preview-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-preview-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.brand-preview-copy strong {
  overflow: hidden;
  color: #203653;
  font-size: 15px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-preview-copy span {
  overflow: hidden;
  color: #8a98ab;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logo-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-hint {
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.5;
}
</style>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="brand-mark" aria-hidden="true">
        <AppstoreOutlined />
      </div>

      <div class="login-heading">
        <h1>后台管理系统</h1>
        <p>ADMIN MANAGEMENT PLATFORM</p>
      </div>

      <div class="heading-divider"><span></span></div>

      <a-form
        class="user-layout-login"
        :model="formState"
        name="loginForm"
        layout="vertical"
        @finish="onFinish"
      >
        <a-form-item
          label="账号"
          name="username"
          :rules="[{ required: true, message: t('Username cannot be empty') }]"
        >
          <a-input
            v-model:value="formState.username"
            type="text"
            size="large"
            autocomplete="username"
            placeholder="请输入账号"
          >
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: t('Password cannot be empty') }]"
        >
          <a-input-password
            v-model:value="formState.password"
            size="large"
            autocomplete="current-password"
            placeholder="请输入密码"
          >
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>

        <div class="login-options">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          <span class="forgot-password">忘记密码?</span>
        </div>

        <a-form-item class="submit-item">
          <a-button
            type="primary"
            html-type="submit"
            class="login-button"
            :loading="isLoading"
            :disabled="isLoading"
          >
            登 录
            <span class="button-arrow" aria-hidden="true">→</span>
          </a-button>
        </a-form-item>
      </a-form>

      <p class="login-footer">安全登录 · 高效管理</p>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref, reactive } from 'vue'
import { notification } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AppstoreOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const formState = reactive({
  username: '',
  password: '',
  remember: true
})
const isLoading = ref(false)
const userStore = useUserStore()

const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 6) return t('Early morning')
  if (hour < 12) return t('Morning')
  if (hour < 14) return t('Noon')
  if (hour < 18) return t('Afternoon')
  if (hour < 20) return t('Evening')
  return t('Night')
}

const onFinish = values => {
  isLoading.value = true
  userStore
    .login(values)
    .then(() => {
      isLoading.value = false
      notification.success({
        message: t('Login successful'),
        description: `${values.username}, ${getTimeOfDay()}${t('Hello, welcome back!')}`,
        duration: 3
      })
      router.push(route.query.redirect || '/')
    })
    .catch(() => {
      isLoading.value = false
    })
}
</script>

<style scoped lang="less">
.login-page {
  width: min(100%, 460px);
  position: relative;
}

.login-card {
  position: relative;
  padding: 42px 40px 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .72);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255, 255, 255, .94), rgba(230, 244, 255, .88));
  box-shadow:
    0 32px 90px rgba(0, 35, 112, .28),
    inset 0 1px 0 rgba(255, 255, 255, .95);
  backdrop-filter: blur(24px);
}

.login-card::before {
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(90deg, #27c9f5, #2475ff, #5c54ef);
  content: '';
}

.brand-mark {
  display: grid;
  width: 58px;
  height: 58px;
  margin: 0 auto 18px;
  place-items: center;
  border: 1px solid rgba(49, 139, 255, .18);
  border-radius: 18px;
  background: linear-gradient(145deg, #e7f8ff, #d8eaff);
  box-shadow: 0 8px 22px rgba(44, 126, 233, .12);
  color: #2479ec;
  font-size: 30px;
}

.login-heading {
  text-align: center;
}

.login-heading h1 {
  margin: 0;
  color: #102d59;
  font-size: clamp(25px, 2vw, 30px);
  font-weight: 750;
  letter-spacing: .08em;
}

.login-heading p {
  margin: 8px 0 0;
  color: #6b84a8;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: .2em;
}

.heading-divider {
  display: flex;
  align-items: center;
  margin: 25px 0 26px;
  background: linear-gradient(90deg, transparent, rgba(77, 127, 188, .28), transparent);
  height: 1px;
}

.heading-divider span {
  width: 42px;
  height: 3px;
  margin: auto;
  border-radius: 4px;
  background: #26bce9;
}

.user-layout-login {
  :deep(.ant-form-item) {
    margin-bottom: 20px;
  }

  :deep(.ant-form-item-label > label) {
    color: #35547d;
    font-size: 13px;
    font-weight: 650;
  }

  :deep(.ant-input-affix-wrapper) {
    min-height: 52px;
    padding: 0 15px;
    border: 1px solid #d9e6f5;
    border-radius: 13px;
    background: rgba(255, 255, 255, .88);
    box-shadow: 0 3px 10px rgba(37, 83, 142, .035);
  }

  :deep(.ant-input-affix-wrapper:hover),
  :deep(.ant-input-affix-wrapper-focused) {
    border-color: #68a7f5;
    box-shadow: 0 0 0 3px rgba(47, 125, 245, .1);
  }

  :deep(.ant-input-prefix) {
    margin-right: 12px;
    color: #7b95b7;
    font-size: 17px;
  }

  :deep(.ant-input) {
    color: #203e68;
    font-size: 14px;
    background: transparent;
  }

  :deep(.ant-input::placeholder) {
    color: #a1b1c6;
  }

  :deep(.ant-form-item-explain-error) {
    font-size: 12px;
  }
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1px 25px;
  color: #45658e;

  :deep(.ant-checkbox-wrapper) {
    color: #45658e;
    font-size: 13px;
  }

  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    border-color: #287df2;
    background: #287df2;
  }
}

.forgot-password {
  color: #4778b6;
  font-size: 13px;
  cursor: default;
  user-select: none;
}

.submit-item {
  margin-bottom: 0 !important;
}

button.login-button {
  display: flex;
  width: 100%;
  height: 54px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(105deg, #28b4f5 0%, #287ef5 48%, #354eea 100%);
  box-shadow: 0 12px 25px rgba(39, 112, 230, .25);
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: .16em;
  transition: transform .2s ease, box-shadow .2s ease;
}

button.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 15px 28px rgba(39, 112, 230, .32);
}

.button-arrow {
  position: absolute;
  right: 22px;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0;
}

.login-footer {
  margin-top: 24px;
  color: #8ba0ba;
  font-size: 11px;
  letter-spacing: .18em;
  text-align: center;
}

@media (max-width: 860px) {
  .login-page {
    width: min(100%, 440px);
  }

  .login-card {
    padding: 36px 34px 24px;
    border-radius: 24px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 24px 20px;
    border-radius: 21px;
  }

  .brand-mark {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    font-size: 27px;
  }
}
</style>

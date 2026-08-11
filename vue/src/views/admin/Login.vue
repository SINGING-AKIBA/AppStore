<template>
  <div class="login-wrapper">
    <a-form 
      class="user-layout-login" 
      :model="formState"
      name="loginForm"
      @finish="onFinish"
    >
      <a-form-item
        name="username"
        :rules="[{ required: true, message: t('Username cannot be empty')}]" 
      >
        <a-input 
          v-model:value="formState.username"
          size="large" 
          type="text" 
          :placeholder="t('Please enter username')" 
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: t('Password cannot be empty') }]"
      >
        <a-input-password 
          v-model:value="formState.password"
          size="large" 
          :placeholder="t('Please enter password')" 
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name='remember'>
        <a-checkbox v-model:checked="formState.remember">{{ t('Auto login') }}</a-checkbox>
      </a-form-item>
      
      <a-form-item style="margin-top:24px">
        <a-button size="large" type="primary" html-type="submit" class="login-button" :loading="isLoading"
          :disabled="isLoading">{{ t('Login') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref ,reactive} from 'vue'
import { notification } from 'ant-design-vue'
import { useRouter ,useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
  const now = new Date();
  const hour = now.getHours();

  if (hour < 6) {
    return t('Early morning');
  } else if (hour < 12) {
    return t('Morning');
  } else if (hour < 14) {
    return t('Noon');
  } else if (hour < 18) {
    return t('Afternoon');
  } else if (hour < 20) {
    return t('Evening');
  } else {
    return t('Night');
  }
}
const onFinish = values => {
  isLoading.value = true
  userStore.login(values).then((res) => {
    isLoading.value = false
    notification.success({
      message: t('Login successful'),
      description: `${values.username}, ${getTimeOfDay()}${t('Hello, welcome back!')}`,
      duration: 3
    });
    // Get redirect address
    let redirect = route.query.redirect || '/';
    router.push(redirect);
  }).catch(err => {
    isLoading.value = false
  })
};
</script>

<style lang="less" scoped>
.login-wrapper{
    width: 360px;
    margin: 0 auto;
    .user-layout-login {
    label {
        font-size: 14px;
    }

    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }

    .forge-password {
        font-size: 14px;
    }

    button.login-button {
        padding: 0 15px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }

    .user-login-other {
        text-align: left;
        margin-top: 24px;
        line-height: 22px;

        .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
            color: #1890ff;
        }
        }

        .register {
        float: right;
        }
    }
    }
}
</style>
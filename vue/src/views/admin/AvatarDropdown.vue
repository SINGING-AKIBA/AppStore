<template>
  <a-dropdown v-if="userStore.userInfo && userStore.userInfo.username" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" src="../../assets/logo.png" class="antd-pro-global-header-index-avatar" />
      {{ userStore.userInfo.username }}
    </span>
    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <UserAddOutlined />
          {{ $t('Personal Center') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <SettingOutlined />
          {{ $t('Change Password') }}
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <LogoutOutlined />
          {{ $t('Log Out') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: '8px', marginRight: '8px' }" />
  </span>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  menu: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();
const userStore = useUserStore();
function handleToCenter() {
  router.push({ path: '/admin/center' });
}

function handleToSettings() {
  router.push({ path: '/admin/settings' });
}

function handleLogout(e) {
  Modal.confirm({
    title: t('Log Out Confirmation'),
    content: t('Are you sure you want to log out?'),
    onOk: () => {
      return userStore.logout().then(() => {
        router.push({ path: '/admin/login' });
      });
    },
    onCancel() {}
  });
}
</script>

<style lang="less" scoped>

</style>
<template>
  <a-config-provider :locale="antLocale">
    <router-view/>
  </a-config-provider>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale,getLocaleMessage} = useI18n();
import dayjs from 'dayjs';
const antLocale = computed(() => {
  let messages  = getLocaleMessage(locale.value);
  dayjs.locale(messages?.dayjs || 'zh-cn');
  return messages?.antDesign || {};
});

</script>

<style lang="less">
@import '@/assets/main.css';
</style>
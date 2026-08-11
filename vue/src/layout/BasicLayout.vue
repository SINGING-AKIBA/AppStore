<template>
  <a-watermark :content="settings.title" :zIndex="100" >
    <pro-layout
        v-bind="settings"
        :openKeys="menuStore.openKeys"
        :selectedKeys="menuStore.selectedKeys"
        :collapsed="collapsed"
        :onCollapse="onCollapse"
    >   
        <!-- 头部 -->
        <template #headerContentRender>
        </template>
        <!-- 右上角 -->
        <template #rightContentRender>
            <RightContent :top-menu="settings.layout === 'topmenu'" :is-mobile="false" :theme="settings.navTheme" />
        </template>
        <template #tabRender="{ width, fixedHeader}">
            <div>
                <div
                    :style="{
                        position: fixedHeader ? 'fixed' : 'unset',
                        width: width,
                    }"
                    class="layout-tabs"
                >
                  <a-tabs
                    v-model:activeKey="menuStore.tabActiveKey"
                    type="editable-card"
                    hide-add
                    @edit="handleTabsEdit"
                    @tabClick="navigatorTo"
                  >
                  <a-tab-pane
                    v-for="(tab,index) in menuStore.tabs"
                    :key="tab.name"
                    :tab="tab.title"
                    :closable="index > 0"
                  /> 
                  </a-tabs>
                </div>
            </div>
            </template>
        <!-- 路径导航 -->
        <template #breadcrumbRender="{ route, params, routes }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.breadcrumbName }}
            </span>
            <router-link v-else :to="{ path: route.path, params }">
                {{ route.breadcrumbName }}
            </router-link>
        </template>
        <!-- 菜单搜索栏 -->
        <!-- <template #menuExtraRender="{ collapsed }">
            <a-input-search v-if="!collapsed" />
        </template> -->
        <!-- 菜单底部 -->
        <!-- <template #menuFooterRender>
            <div style="color:#ffffff">menu footer</div>
        </template> -->
        <!-- 水印 -->
        <router-view v-slot="{ Component,route }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive :include="menuStore.cacheCmponents" ref="keepAliveRef">
              <component :is="Component" :key="route.fullPath"/>
            </keep-alive>
          </transition>
        </router-view>
    </pro-layout>
  </a-watermark>
</template>   
<script>
import "@ant-design-vue/pro-layout/dist/style.css";
</script>
<script setup>
import RightContent from '@/views/admin/RightContent.vue'
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import config  from "@/config";
import { ref,nextTick} from "vue";

const router = useRouter();
const collapsed = ref(false);
const menuStore = useMenuStore();
const userStore = useUserStore();
const keepAliveRef = ref(null);
const clearMenuItem = (menus) => {
  return menus.filter(item => {
    if (item.children && item.children.length > 0) {
      item.children = clearMenuItem(item.children);
    }
    item.meta.icon = item.meta.icon ? 'icon-'+item.meta.icon : '';
    return item.meta.show;
  })
};
const menuData = clearMenuItem(userStore.menus);
const settings = {
    ...config.layout,
    menuData,
}
const onCollapse = (val) => {
  collapsed.value = val;
};
const navigatorTo = (key) => {
  let tab  = menuStore.tabs.find(item=>item.name === key);
  if(tab){
    router.push(tab);
  }
}
const handleTabsEdit = (targetKey, action) => {
  if (action === 'remove') {
    let path = menuStore.closeTab(targetKey);
    if(path){
      nextTick(()=>{
        router.push(path);
      })
    }
  }
};
</script>

<style scoped lang="less">
.layout-tabs {
    margin: 0;
    z-index: 14;
    padding: 0px 16px;
    background: #fff;
    transition: background 0.3s, width 0.2s;
    box-sizing: border-box;
}
</style>
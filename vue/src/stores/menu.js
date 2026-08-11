import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const tabs = ref([]);//tab列表
  const tabActiveKey = ref(null);//当前激活的tab
  const openKeys = ref([]);//菜单展开的key
  const selectedKeys = ref([]);//菜单选中的key
  const cacheCmponents = ref([]);//缓存组件 
  /**
   * 添加tab
   */
  const addTab = (router) => {
    // 转为小写
    let path = router.path.toLowerCase();
    const tabExists = tabs.value.some(tab => tab.path === path);
    if(!tabExists){
        tabs.value.push({ 
            title: router.meta.title || router.name,
            path,
            name: router.name,
            query: router.query,
            params: router.params,
        })
        //首字母大写
        const name = String(router.name ?? '').replace(/^./, (char) => char.toUpperCase());
        cacheCmponents.value.push(name);
        selectedKeys.value = [name];
    }
    tabActiveKey.value = router.name;
    const matched = router.matched;
    selectedKeys.value = matched.map(r => r.path);
    openKeys.value = matched.filter(r => r.path !== router.path).map(r => r.path);
  }
  /**
   * 关闭tab
   */
  const closeTab = (name) => {
    const index = tabs.value.findIndex(tab => tab.name === name);
    let lastPath = false;
    if(name === tabActiveKey.value){
      let lastTab = tabs.value[index - 1];
      tabActiveKey.value = lastTab.name;
      lastPath = lastTab.path;
    }
    const tab = tabs.value[index];
    cacheCmponents.value = cacheCmponents.value.filter(item => item !== tab.name);
    tabs.value.splice(index, 1);
    return lastPath;
  }

  return { 
    tabs,
    addTab,
    closeTab,
    tabActiveKey,
    cacheCmponents,
    selectedKeys,
    openKeys,
  }
})

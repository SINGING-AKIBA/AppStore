<template>
    <div>
      <div>
        <a-button type="link" @click="show">{{ currentLink.title || '选择链接' }}</a-button>
      </div>
      <a-modal 
        :open="visible" 
        :title="title" 
        :width="800"
        :confirm-loading="isLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
      >
        <div class="link-box">
          <a-collapse :bordered="false" v-model:activeKey="group_keys">
            <a-collapse-panel v-for="g in links" :key="g.key" :header="g.title">
              <a-tag 
                v-for="link in g.links" 
                :key="link.key"
                :color="currentLink.key === link.key ? '#40a9ff' : ''"
                @click="handleSelect(link)"
              >
                {{ link.title }}
              </a-tag>
            </a-collapse-panel>
          </a-collapse>
          <a-drawer
            :title="drawer.title"
            placement="right"
            :width="350"
            :closable="false"
            :open="drawer.visible"
            :wrap-style="{ position: 'absolute' }"
            :get-container="false"
            @close="onCloseDrawer"
          >
            <a-form v-if="drawer.visible" :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-form-item
                v-for="(item, index) in currentLink.form"
                :key="index"
                :label="item.label"
                :extra="item.tips"
              >
                <a-input
                  v-model:value="formState.values[index]"
                  :rules="[{ required: item.required, message: `${item.label}必须填写` }]"
                />
              </a-form-item>
            </a-form>
          </a-drawer>
        </div>
      </a-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch,computed } from 'vue';
  import links from './data.js';
  import _ from 'lodash';
  
  // 定义 props
  const props = defineProps({
    value: Object,
  });
  
  // 初始化数据
  const visible = ref(false);
  const title = ref('选择链接');
  const isLoading = ref(false);
  const currentLink = ref({});
  const drawer = reactive({
    title: '',
    visible: false,
  });
  const formState = reactive({
    values: {},
  });
  
  // 计算属性：collapse 默认全部展开
  const group_keys = computed(() => links.map(item => item.key));
  
  // 监听 props 的变化
  watch(
    () => props.value,
    (newValue) => {
      if (newValue) {
        currentLink.value = newValue;
        const that = _.find(links, { key: newValue.key });
        if (that && that.form) {
          currentLink.value.form = that.form.map((item) => {
            item.value = '';
            if (newValue.query) {
              item.value = newValue.query[item.key] || '';
            }
            return item;
          });
        }
      }
    },
    { immediate: true }
  );
  
  // 显示 modal
  const show = (record) => {
    visible.value = true;
    if (record) {
      handleSelect(record);
    }
  };
  
  // 提交表单
  const handleSubmit = () => {
    const query = {};
    if (formState.values) {
      Object.keys(formState.values).forEach((index) => {
        const item = currentLink.value.form[index];
        item.value = formState.values[index];
        query[item.key] = item.value;
      });
    }
  
    const link = {
      page: currentLink.value.page,
      title: currentLink.value.title,
      query,
      key: currentLink.value.key,
    };
  
    emit('change', link);
    handleCancel();
    formState.values = {};
  };
  
  // 取消 modal
  const handleCancel = () => {
    visible.value = false;
    onCloseDrawer();
  };
  
  // 选择链接
  const handleSelect = (link) => {
    currentLink.value = link;
    showDrawer();
  };
  
  // 显示抽屉
  const showDrawer = () => {
    if (currentLink.value.form) {
      drawer.title = currentLink.value.title;
      drawer.visible = true;
    }
  };
  
  // 关闭抽屉
  const onCloseDrawer = () => {
    drawer.visible = false;
  };
  
  // 使用 defineEmits 定义自定义事件
  const emit = defineEmits(['change']);
  </script>
<style lang="less" scoped>
:deep(.ant-modal-body) {
  background: #fafafa;
  position: relative;
  min-height: 360px;
  overflow: hidden;
}
:dee(.ant-collapse) > .ant-collapse-item,:deep(.ant-collapse-borderless) > .ant-collapse-item{
    border-bottom: none;
}
:deep(.ant-tag){
    padding: 5px 20px;
}
</style>
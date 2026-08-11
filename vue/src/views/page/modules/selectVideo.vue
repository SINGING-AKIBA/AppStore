<template>
    <a-modal :open="visible" :title="title" :width="900" @cancel="handleCancel" @ok="onFormSubmit" destroyOnClose>
      <div class="table-operator">
        <!-- 搜索板块 -->
        <a-row class="row-item-search">
          <a-form class="search-form" layout="inline" @finish="handleSearch">
            <a-form-item label="名称">
              <a-input v-model:value="searchForm.title" placeholder="请输入短剧名称" />
            </a-form-item>
            <a-form-item label="短剧状态">
              <a-select v-model:value="searchForm.on_line_switch" style="width:100px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="10">线上</a-select-option>
                <a-select-option :value="20">已下架</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="search-btn">
              <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">
                <template #icon><SearchOutlined /></template>搜索
              </a-button>
            </a-form-item>
          </a-form>
        </a-row>
      </div>
      <s-table
        :columns="columns"
        :data="loadData"
        rowKey="id"
        ref="table"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        size="small"
      >
      </s-table>
    </a-modal>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import _ from "lodash";
  import { SearchOutlined } from '@ant-design/icons-vue';
  
  const visible = ref(false);
  const title = ref('选择短剧');
  const loading = ref(false);
  const selectedRowKeys = ref([]);
  const selectData = ref([]);
  const current_list = ref([]);
  const queryParams = reactive({});
  const searchForm = reactive({
    title: '',
    on_line_switch: ''
  });
  
  const columns = [
    {
      title: '短剧名称',
      dataIndex: 'title',
      width: 200,
      ellipsis: true
    },
    {
      title: '点赞数量',
      dataIndex: 'like_number'
    },
    {
      title: '收藏数量',
      dataIndex: 'collect_number'
    },
    {
      title: '状态',
      dataIndex: 'on_line_switch',
      customRender: ({ text }) => ({
        10: '线上',
        20: '已下架'
      }[text])
    },
  ];
  
  const loadData = (param) => {
    return index({ ...param, ...queryParams }).then(response => {
      loading.value = false;
      current_list.value = response.data.data;
      return response.data;
    });
  };
  
  const show = (record) => {
    visible.value = true;
    if (record) {
      selectedRowKeys.value = record;
    }
  };
  
  const handleCancel = () => {
    selectedRowKeys.value = [];
    visible.value = false;
  };
  
  const onFormSubmit = () => {
    current_list.value.forEach(item => {
      if (selectedRowKeys.value.includes(item.id)) {
        selectData.value.push({
          id: item.id,
          title: item.title,
          imageList: item.imageList,
          short_play_desc: item.short_play_desc,
          categoryList: item.categoryList,
        });
      }
    });
    emit('onChange', selectData.value);
    selectData.value = [];
    handleCancel();
  };
  
  const handleSearch = () => {
    selectData.value = [];
    selectedRowKeys.value = [];
    loading.value = true;
    queryParams.title = searchForm.title;
    queryParams.on_line_switch = searchForm.on_line_switch;
    handleRefresh();
  };
  
  const handleRefresh = (bool = false) => {
    table.value?.refresh(bool);
  };
  
  const onSelectChange = (keys) => {
    selectedRowKeys.value = keys;
  };
  
  const emit = defineEmits(['changeVideo']);
  
  const table = ref(null);
  defineExpose({
    show,
  });
  </script>
  
  <style scoped>
  /* 添加必要的样式 */
  .search-btn {
    margin-left: 16px;
  }
  </style>
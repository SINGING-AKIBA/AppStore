<template>
  <a-card>
    <div class="table-operator">
      <a-row class="row-item-search" v-show="showSearch">
        <a-form 
          class="search-form" 
          ref="searchForm"
          layout="inline"
          :model="formData"
          :rules="{}"
          :label-col="{ style:{width: '120px' } }"
          :wrapper-col="{ style:{width: '200px'} }"
          @finish="handleSearch"
        > 
          <a-form-item name="name" label="队列名称" >
            <a-input v-model:value="formData.name" placeholder="请输入队列名称" />
          </a-form-item>

          <a-form-item>
            <div class="flex flex-row">
              <a-button type="primary" html-type="submit" :loading="isLoading" :disabled="isLoading"><SearchOutlined />{{ $t('search') }}</a-button>
              <a-button type="default" @click="searchFormReset"><ReloadOutlined />{{ $t('reset') }}</a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <a-row class='row-item-group'>
      <a-col :span="18" class="flex flex-row flex-start">
        <a-button type="dark" @click="handleRefresh">
          <ReloadOutlined />
        </a-button>
      </a-col>
      <a-col class="flex flex-row flex-end" :span="6">
        <a-button type="default" @click="onShowSearch">
          <SearchOutlined />
        </a-button>
      </a-col>
    </a-row>
    <s-table 
      :columns="columns" 
      :data="getDataList"
      :scroll="{ x: 'max-content' }"
      ref="table" 
      rowKey="name"
    >
      <template #bodyCell="item">
        <template v-if="item.column.dataIndex === 'waiting'">
          <a-tag color="blue">{{ item.record.waiting || 0 }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'active'">
          <a-tag color="processing">{{ item.record.active || 0 }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'completed'">
          <a-tag color="success">{{ item.record.completed || 0 }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'failed'">
          <a-tag color="error">{{ item.record.failed || 0 }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'delayed'">
          <a-tag color="orange">{{ item.record.delayed || 0 }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'isPaused'">
          <a-tag :color="item.record.isPaused ? 'warning' : 'success'">
            {{ item.record.isPaused ? '已暂停' : '运行中' }}
          </a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="handleView(item.record)">
              <EyeOutlined /> 查看
            </a-button>
            <a-button type="link" size="small" @click="handleTogglePause(item.record)">
              <PauseCircleOutlined v-if="!item.record.isPaused" />
              <PlayCircleOutlined v-else />
              {{ item.record.isPaused ? '恢复' : '暂停' }}
            </a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu @click="(e) => handleMenuClick(e, item.record)">
                  <a-menu-item key="cleanFailed">
                    <DeleteOutlined /> 清理失败任务
                  </a-menu-item>
                  <a-menu-item key="cleanCompleted">
                    <DeleteOutlined /> 清理已完成任务
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button type="link" size="small">
                <MoreOutlined /> 更多
              </a-button>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </s-table>
  </a-card>
</template> 
<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { index, pause, resume, clean } from '@/api/Queue';
import { ref, reactive } from 'vue';
import { Modal, message } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
  name: 'queue.Index'
})
const { t } = useI18n();
const router = useRouter();

const showSearch = ref(false);
const searchForm = ref(null);
const formData = reactive({});
let queryParams = reactive({});

const onShowSearch = () => {
  showSearch.value = !showSearch.value;
}

const handleSearch = (values) => {
  queryParams = Object.assign(queryParams, values)
  handleRefresh(true)
}

const searchFormReset = () => {
  searchForm.value.resetFields();
}

const table = ref(null);
const isLoading = ref(false);
const selectedRowKeys = ref([]);
const localDataSource = ref([]);

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    disabled: false,
    width: '80px',
  },
  {
    title: '队列名称',
    dataIndex: 'name',
    fixed: 'left',
    width: '200px',
  },
  {
    title: '等待中',
    dataIndex: 'waiting',
    width: '100px',
  },
  {
    title: '进行中',
    dataIndex: 'active',
    width: '100px',
  },
  {
    title: '已完成',
    dataIndex: 'completed',
    width: '100px',
  },
  {
    title: '失败',
    dataIndex: 'failed',
    width: '100px',
  },
  {
    title: '延迟',
    dataIndex: 'delayed',
    width: '100px',
  },
  {
    title: '状态',
    dataIndex: 'isPaused',
    width: '100px',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: '250px',
  }
]);

const getDataList = (param) => {
  isLoading.value = true;
  return index({ ...param, ...queryParams }).then(res => {
    isLoading.value = false;
    localDataSource.value = res.data.data || res.data || [];
    return {
      data: localDataSource.value,
      total: localDataSource.value.length
    };
  })
}

const handleRefresh = (bool = false) => {
  table.value.refresh(bool)
}

const handleView = (record) => {
  router.push({
    path: 'detail',
    query: {
      name: record.name
    }
  })
}

const handleAdd = () => {
  router.push({
    path: 'add'
  })
}

const handleTogglePause = (record) => {
  const action = record.isPaused ? resume : pause;
  const actionText = record.isPaused ? '恢复' : '暂停';
  
  Modal.confirm({
    title: '确认操作',
    content: `确定要${actionText}队列 "${record.name}" 吗？`,
    onOk: () => {
      action({ name: record.name }).then(() => {
        message.success(`队列${actionText}成功`);
        handleRefresh();
      });
    }
  });
}

const handleMenuClick = (e, record) => {
  const key = e.key;
  let content = '';
  let apiCall = null;
  
  switch (key) {
    case 'cleanFailed':
      content = `确定要清理队列 "${record.name}" 中所有失败的任务吗？`;
      apiCall = () => clean({ name: record.name, status: 'failed', grace: 5000, limit: 100 });
      break;
    case 'cleanCompleted':
      content = `确定要清理队列 "${record.name}" 中所有已完成的任务吗？`;
      apiCall = () => clean({ name: record.name, status: 'completed', grace: 5000, limit: 100 });
      break;
  }
  
  if (apiCall) {
    Modal.confirm({
      title: '确认操作',
      content: content,
      onOk: () => {
        apiCall().then(() => {
          message.success('操作成功');
          handleRefresh();
        });
      }
    });
  }
}
</script>

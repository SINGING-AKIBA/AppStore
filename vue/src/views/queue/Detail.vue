<template>
  <a-card>
    <a-page-header @back="() => router.back()" :title="queueName">
      <template #extra>
        <a-button type="primary" @click="handleRefresh">
          <ReloadOutlined /> 刷新
        </a-button>
      </template>
    </a-page-header>
    
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="等待中" :value="stats.waiting" :value-style="{ color: '#1890ff' }">
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="进行中" :value="stats.active" :value-style="{ color: '#1890ff' }">
            <template #prefix>
              <SyncOutlined :spin="true" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="已完成" :value="stats.completed" :value-style="{ color: '#52c41a' }">
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable>
          <a-statistic title="失败" :value="stats.failed" :value-style="{ color: '#ff4d4f' }">
            <template #prefix>
              <CloseCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
      <a-tab-pane key="waiting" tab="等待中" />
      <a-tab-pane key="active" tab="进行中" />
      <a-tab-pane key="completed" tab="已完成" />
      <a-tab-pane key="failed" tab="失败" />
    </a-tabs>

    <div class="table-operator">
      <a-row class="row-item-search" v-show="showSearch">
        <a-form 
          class="search-form" 
          ref="searchForm"
          layout="inline"
          :model="formData"
          :label-col="{ style:{width: '120px' } }"
          :wrapper-col="{ style:{width: '200px'} }"
          @finish="handleSearch"
        > 
          <a-form-item name="id" label="任务ID" >
            <a-input v-model:value="formData.id" placeholder="请输入任务ID" />
          </a-form-item>

          <a-form-item>
            <div class="flex flex-row">
              <a-button type="primary" html-type="submit" :loading="isLoading" :disabled="isLoading">
                <SearchOutlined />{{ $t('search') }}
              </a-button>
              <a-button type="default" @click="searchFormReset">
                <ReloadOutlined />{{ $t('reset') }}
              </a-button>
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
        <a-button type="primary" danger @click="handleRetrySelected" :disabled="!selectedRowKeys.length || activeTab !== 'failed'">
          <RedoOutlined /> 重新执行
        </a-button>
        <a-button type="danger" @click="handleDeleteSelected" :disabled="!selectedRowKeys.length">
          <DeleteOutlined /> 删除
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
      :row-selection="rowSelection"
      :scroll="{ x: 'max-content' }"
      ref="table" 
      rowKey="id"
    >
      <template #bodyCell="item">
        <template v-if="item.column.dataIndex === 'status'">
          <a-tag :color="getStatusColor(item.record.status)">
            {{ getStatusText(item.record.status) }}
          </a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'progress'">
          <a-progress :percent="(item.record.progress || 0) * 100" size="small" v-if="item.record.status === 'active'" />
          <span v-else>{{ ((item.record.progress || 0) * 100).toFixed(0) }}%</span>
        </template>
        <template v-else-if="item.column.dataIndex === 'attempts'">
          {{ item.record.attemptsMade || 0 }}
        </template>
        <template v-else-if="item.column.dataIndex === 'createdAt'">
          {{ formatTime(item.record.timestamp) }}
        </template>
        <template v-else-if="item.column.dataIndex === 'finishedOn'">
          {{ item.record.finishedOn ? formatTime(item.record.finishedOn) : '-' }}
        </template>
        <template v-else-if="item.column.dataIndex === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="handleViewJob(item.record)">
              <EyeOutlined /> 查看
            </a-button>
            <a-button type="link" size="small" @click="handleRetryJob(item.record)" v-if="item.record.status === 'failed'">
              <RedoOutlined /> 重试
            </a-button>
            <a-button type="link" size="small" danger @click="handleDeleteJob(item.record)">
              <DeleteOutlined /> 删除
            </a-button>
          </a-space>
        </template>
      </template>
    </s-table>

    <a-modal
      v-model:open="detailModalVisible"
      :title="`任务详情 - ${currentJob?.id}`"
      width="800px"
      :footer="null"
    >
      <a-descriptions :column="1" bordered v-if="currentJob">
        <a-descriptions-item label="任务ID">
          {{ currentJob.id }}
        </a-descriptions-item>
        <a-descriptions-item label="队列">
          {{ queueName }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(currentJob.status)">
            {{ getStatusText(currentJob.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="进度">
          {{ ((currentJob.progress || 0) * 100).toFixed(2) }}%
        </a-descriptions-item>
        <a-descriptions-item label="重试次数">
          {{ currentJob.attemptsMade || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ formatTime(currentJob.timestamp) }}
        </a-descriptions-item>
        <a-descriptions-item label="完成时间">
          {{ currentJob.finishedOn ? formatTime(currentJob.finishedOn) : '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="处理耗时">
          {{ currentJob.finishedOn && currentJob.processedOn ? ((currentJob.finishedOn - currentJob.processedOn) / 1000).toFixed(2) + 's' : '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="失败原因" v-if="currentJob.failedReason">
          <a-alert type="error" :message="currentJob.failedReason" />
        </a-descriptions-item>
        <a-descriptions-item label="数据">
          <a-input.TextArea 
            :value="JSON.stringify(currentJob.data, null, 2)" 
            :rows="6" 
            readonly 
          />
        </a-descriptions-item>
        <a-descriptions-item label="返回值" v-if="currentJob.returnValue">
          <a-input.TextArea 
            :value="JSON.stringify(currentJob.returnValue, null, 2)" 
            :rows="6" 
            readonly 
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </a-card>
</template> 
<script setup>
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { index, jobs, retry, remove } from '@/api/Queue';
import { ref, reactive, onMounted, watch } from 'vue';
import { Modal, message } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
  name: 'queue.Detail'
})
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const queueName = ref(route.query.name || '');
const activeTab = ref('waiting');
const showSearch = ref(false);
const searchForm = ref(null);
const formData = reactive({});
let queryParams = reactive({});

const stats = reactive({
  waiting: 0,
  active: 0,
  completed: 0,
  failed: 0
});

const table = ref(null);
const isLoading = ref(false);
const selectedRowKeys = ref([]);
const localDataSource = ref([]);

const detailModalVisible = ref(false);
const currentJob = ref(null);

const rowSelection = {
  onChange: (keys, selectedRows) => {
    selectedRowKeys.value = keys;
  }
};

const columns = ref([
  {
    title: '任务ID',
    dataIndex: 'id',
    width: '80px',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '100px',
  },
  {
    title: '进度',
    dataIndex: 'progress',
    width: '120px',
  },
  {
    title: '重试次数',
    dataIndex: 'attempts',
    width: '100px',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: '180px',
  },
  {
    title: '完成时间',
    dataIndex: 'finishedOn',
    width: '180px',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: '180px',
  }
]);

onMounted(() => {
  if (queueName.value) {
    loadStats();
  }
});

watch(() => route.query.name, (newName) => {
  queueName.value = newName;
  loadStats();
  handleRefresh();
});

const loadStats = () => {
  index({ name: queueName.value }).then(res => {
    const queueList = res.data || [];
    const queue = queueList.find(q => q.name === queueName.value);
    if (queue) {
      stats.waiting = queue.waiting || 0;
      stats.active = queue.active || 0;
      stats.completed = queue.completed || 0;
      stats.failed = queue.failed || 0;
    }
  }).catch(() => {
    stats.waiting = 0;
    stats.active = 0;
    stats.completed = 0;
    stats.failed = 0;
  });
};

const activeTabKey = {
  waiting: 'waiting',
  active: 'active',
  completed: 'completed',
  failed: 'failed'
};

const getDataList = (param) => {
  isLoading.value = true;
  const params = { 
    name: queueName.value,
    status: activeTabKey[activeTab.value] || activeTab.value,
    ...queryParams,
    ...param,
  };
  return jobs(params).then(res => {
    isLoading.value = false;
    localDataSource.value = res.data.data;
    return res.data;
  })
};

const handleRefresh = () => {
  loadStats();
  if (table.value) {
    table.value.refresh(true);
  }
};

const handleTabChange = (key) => {
  activeTab.value = key;
  selectedRowKeys.value = [];
  queryParams = {};
  if (searchForm.value) {
    searchForm.value.resetFields();
  }
  handleRefresh();
};

const handleSearch = (values) => {
  queryParams = Object.assign(queryParams, values)
  handleRefresh();
};

const searchFormReset = () => {
  if (searchForm.value) {
    searchForm.value.resetFields();
  }
  Object.assign(queryParams, {});
};

const onShowSearch = () => {
  showSearch.value = !showSearch.value;
};

const getStatusColor = (status) => {
  const colors = {
    waiting: 'blue',
    active: 'processing',
    completed: 'success',
    failed: 'error',
    delayed: 'orange',
    paused: 'warning'
  };
  return colors[status] || 'default';
};

const getStatusText = (status) => {
  const texts = {
    waiting: '等待中',
    active: '进行中',
    completed: '已完成',
    failed: '失败',
    delayed: '延迟',
    paused: '已暂停'
  };
  return texts[status] || status;
};

const formatTime = (timestamp) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const handleViewJob = (record) => {
  currentJob.value = record;
  detailModalVisible.value = true;
};

const handleRetryJob = (record) => {
  Modal.confirm({
    title: '确认重试',
    content: `确定要重新执行任务 #${record.id} 吗？`,
    onOk: () => {
      retry({ name: queueName.value, id: record.id }).then(() => {
        message.success('任务已重新加入队列');
        handleRefresh();
      });
    }
  });
};

const handleDeleteJob = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除任务 #${record.id} 吗？`,
    onOk: () => {
      remove({ name: queueName.value, id: String(record.id) }).then(() => {
        message.success('任务删除成功');
        handleRefresh();
      });
    }
  });
};

const handleRetrySelected = () => {
  Modal.confirm({
    title: '确认重试',
    content: `确定要重新执行选中的 ${selectedRowKeys.value.length} 个任务吗？`,
    onOk: () => {
      const promises = selectedRowKeys.value.map(id => 
        retry({ name: queueName.value, id: String(id) })
      );
      Promise.all(promises).then(() => {
        message.success('任务已重新加入队列');
        selectedRowKeys.value = [];
        handleRefresh();
      });
    }
  });
};

const handleDeleteSelected = () => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个任务吗？`,
    onOk: () => {
      const promises = selectedRowKeys.value.map(id => 
        remove({ name: queueName.value, id: String(id) })
      );
      Promise.all(promises).then(() => {
        message.success('任务删除成功');
        selectedRowKeys.value = [];
        handleRefresh();
      });
    }
  });
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>

<template>
  <a-card>
    <div class="table-operator">
      <a-row class="row-item-search" v-show="showSearch">
        <a-form 
          class="search-form" 
          ref="searchForm"
          layout="inline"
          :model="searchFormData"
          :rules="{}"
          :label-col="{ style:{width: '120px' }}"
          :wrapper-col="{ style:{width: '200px'} }"
          @finish="handleSearch"
        > 
          <a-form-item label="上传来源" name="channel">
            <a-select v-model:value="searchFormData.channel" class="select">
              <a-select-option value="">全部</a-select-option>
              <a-select-option :value="10">总后台</a-select-option>
              <a-select-option :value="20">管理后台</a-select-option>
              <a-select-option :value="30">客户端</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="文件类型" name="type">
            <a-select v-model:value="searchFormData.type" class="select">
              <a-select-option value="">全部</a-select-option>
              <a-select-option :value="10">图片</a-select-option>
              <a-select-option :value="20">附件</a-select-option>
              <a-select-option :value="30">视频</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="名称" name="name">
            <a-input v-model:value="searchFormData.name" placeholder="请输入管理名称" />
          </a-form-item>
          <a-form-item label="上传时间" name="create_time">
            <a-range-picker v-model:value="searchFormData.create_time" format="YYYY-MM-DD" valueFormat="X" />
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
        <a-button type="dark" @click="handleRefresh(true)">
          <ReloadOutlined />
        </a-button>
        <a-button type="primary" @click="handleAdd()">
          <PlusOutlined />
          {{ $t('add') }}
        </a-button>
        <a-button type="green" @click="handleEdit()"
          :disabled="selectedRowKeys.length !== 1">
          <EditOutlined />
          {{ $t('edit') }}
        </a-button>
        <a-button type="danger" @click="handleDelete()" :disabled="!selectedRowKeys.length">
          <DeleteOutlined />
          {{ $t('delete') }}
        </a-button>
      </a-col>
      <a-col class="flex flex-row flex-end" :span="6">
        <a-input type="text" class="filter" @change="handleFilter" :placeholder="$t('Please enter filter keywords')" />
        <a-dropdown :trigger="['click']">
          <template #overlay>
            <a-menu class="s-title-filter-columns" @click="handleSelectColumns">
              <a-menu-item v-for="(item, index) in columns" :key="index">
                <a-checkbox :checked="!item.disabled" :key="index">
                  {{ item.title }}
                </a-checkbox>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary"><TableOutlined /></a-button>
        </a-dropdown>
        <a-dropdown :trigger="['click']">
          <template #overlay>
            <a-menu @click="handleExport">
              <a-menu-item key="xlsx">
                XLSX
              </a-menu-item>
              <a-menu-item key="csv">
                CSV
              </a-menu-item>
              <a-menu-item key="html">
                HTML
              </a-menu-item>
              <a-menu-item key="pdf">
                PDF
              </a-menu-item>
              <a-menu-item key="rtf">
                RTF
              </a-menu-item>
            </a-menu>
          </template>
          <a-button><DownloadOutlined /></a-button>
        </a-dropdown>
        <a-button type="default" @click="onShowSearch">
          <SearchOutlined />
        </a-button>
      </a-col>
    </a-row>
    <s-table 
      :columns="columns.filter(item => !item.disabled)" 
      :data="getDataList"
      :row-selection="rowSelection"
      :scroll="{ x: 'max-content' }"
      ref="table" 
      rowKey="id"
    >
      <template #bodyCell="item">
        <table-actions 
          v-if="item.column.dataIndex === 'actions'"
          :showView="false" 
          :data="item.record"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <template v-if="item.column.dataIndex === 'cover_url'">
          <a-image v-if="item.record?.type==10" :src="item?.text" :height="45" />
          <a-video v-if="item.record?.type==30" :src="item?.text" :height="45" />
        </template>
        
      </template>
    </s-table>
    <Edit ref="EditModal" @onsubmit="handleRefresh" />
    <FilesModal 
      ref="FileModal"
      :multiple="true"
      :maxNum="100"
      :selectedNum="0"
      :type="10"
      @handleSubmit="handleRefresh"
    />
  </a-card>
</template> 
<script setup>
import { ref, reactive } from 'vue';
import { index, remove } from '@/api/File';
import { Modal,message } from 'ant-design-vue';
import * as XLSX from 'xlsx';
import Edit from './Edit.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const route = useRoute();
const EditModal = ref(null);
const FileModal = ref(null);

const showSearch = ref(false);
const searchForm = ref(null);
const searchFormData = reactive({});
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
const rowSelection = {
  onChange: (keys, selectedRows) => {
    selectedRowKeys.value = keys;
  }
};
const columns = ref([
{
    title: 'ID',
    dataIndex: 'id',
    disabled: false,
  },
  {
    title: '预览',
    dataIndex: 'cover_url',
    disabled: false
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    disabled: false,
  },
  {
    title: '分组',
    dataIndex: 'group',
    disabled: false,
    customRender: ({text}) => (text ? text.name : '未分组')
  },
  {
    title: '存储方式',
    dataIndex: 'storage',
    disabled: false,
    customRender: ({text}) => ({
      local: '本地',
      qiniu: '七牛云',
      aliyun: '阿里云',
      qcloud: '腾讯云',
    }[text])
  },
  {
    title: '上传来源',
    dataIndex: 'channel',
    disabled: false,
    customRender: ({text}) => ({
      10: '总后台',
      20: '管理后台',
      30: '客户端',
    }[text])
  },
  {
    title: '文件类型',
    dataIndex: 'type',
    disabled: false,
    customRender: ({text}) => ({
      10: '图片',
      20: '附件',
      30: '视频',
    }[text])
  },
  {
    title: '文件大小(KB)',
    disabled: false,
    dataIndex: 'size',
  },
  {
    title: '后缀',
    dataIndex: 'ext',
    disabled: false,
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
    disabled: false,
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: '150px',
    disabled: false,
  }
]);
/**
 * 获取数据列表
 */
const getDataList = (param) => {
  isLoading.value = true;
  return index({ ...param, ...queryParams }).then(res => {
    isLoading.value = false;
    localDataSource.value = res.data.data;
    return res.data;
  })
}
const handleRefresh = (bool = false) => {
  table.value.refresh(bool)
}
const handleEdit = (record) => {
  if (!record) {
    record = localDataSource.value.filter(item => item.id === selectedRowKeys.value[0])
    record = record.length ? record[0] : null
  }
  EditModal.value.show(record)
}
const handleAdd = () => {
  FileModal.value.show(false)
}
/**
 * 删除数据
 */
const handleDelete = (item) => {
  let ids = item ? { id :[item.id]} : { id: selectedRowKeys.value }
  Modal.confirm({
    title: t('Friendly Reminder'),
    content: t('Are you sure you want to delete? This action cannot be undone!'),
    onOk: () => {
      remove(ids).then(() => {
        message.success(t('Deletion successful.'))
        handleRefresh();
        item.id || (selectedRowKeys.value=[])
      })
    }
  })
}
const getCustomRenderResult = (key, val) => {
  let column = columns.value.filter(item => item.dataIndex == key);
  if (column.length > 0 && typeof column[0].customRender == 'function') {
    return column[0].customRender(val)
  }
  return false;
}
/**
 * 过滤数据
 */
const handleFilter = (e) => {
  let value = e.target.value
  if (!value) {
    table.value.localDataSource = localDataSource.value
    return
  }
  table.value.localDataSource = localDataSource.value.filter(item => {
    for (let key in item) {
      if ((typeof item[key] == 'string') || (typeof item[key] == 'number')) {
        let str = getCustomRenderResult(key, { text:item[key] || '' }) || item[key].toString();
        if (str.indexOf(value) > -1) {
          return true;
        }
      }
    }
    return false;
  });
}
/**
 * 选择列
 */
const handleSelectColumns = (e) => {
    columns.value[e.key].disabled = !columns.value[e.key].disabled;
    e.preventDefault()
}

/**
 * 导出数据
 */
const handleExport = (e) => {
    if (localDataSource.value.length < 1) {
        message.error(t('No data available for export!'));
        return;
    }
    let data = [
        [...columns.value.map(item => item.title)],
        ...localDataSource.value.map(item =>columns.value.map(column => getCustomRenderResult(column.dataIndex, {text:item[column.dataIndex] }) || item[column.dataIndex]))
    ]
    let fileName = (route.meta.title || route.name) + (new Date().getTime()) + '.' + e.key;
    const WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const WordBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(WordBook, WorkSheet, 'Sheet1');
    XLSX.writeFile(WordBook, fileName);
}

</script>
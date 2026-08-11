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
        <a-form-item name="app_info_id" label="APP ID" >
          <a-select v-model:value="formData.app_info_id" placeholder="请选择APP ID" mode="default" allowClear :filter-option="false" show-search @search="appInfoSearch"><a-select-option v-for="item in appInfoOptions" :key="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="platform" label="适用平台" >
          <a-select v-model:value="formData.platform" placeholder="请选择适用平台" mode="default" allowClear ><a-select-option value="ios">iOS</a-select-option><a-select-option value="android">安卓</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="sort_order" label="排序（升序）" >
          <a-input-number v-model:value="formData.sort_order" placeholder="请输入排序（升序）"   min="0"  />
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
        <a-button type="primary" @click="handleAdd()" v-permission="'appscreenshot.add'">
          <PlusOutlined />
          {{ $t('add') }}
        </a-button>
        <a-button type="green" @click="handleEdit()" :disabled="selectedRowKeys.length !== 1"  v-permission="'appscreenshot.update'">
          <EditOutlined />
          {{ $t('edit') }}
        </a-button>
        <a-button type="danger" @click="handleDelete()" :disabled="!selectedRowKeys.length" v-permission="'appscreenshot.delete'">
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
        <div v-permission="'appscreenshot.export'">
          <a-dropdown :trigger="['click']" >
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
        </div>
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
          :data="item.record"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <template v-if="item.column.dataIndex ==='image'" ><div class="table-image"><a-image v-for="i in (item.text ? item.text.split(','):[])" :width="45" :height="45" :src="i" :key="i" /></div></template>
      </template>
    </s-table>
  </a-card>
</template> 
<script setup>
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { debounce } from 'lodash'
import { useI18n } from 'vue-i18n';
import { useRoute,useRouter } from 'vue-router';
import { index, remove } from '@/api/AppScreenshot';
import { ref, reactive,onMounted } from 'vue';
import { Modal,message } from 'ant-design-vue';
import { select as appInfoSelectApi } from '@/api/AppInfo';


defineOptions({
  inheritAttrs: false,
  name: 'appscreenshot.Index'
})
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
/**
 * 搜索表达
 */
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

/**
 * 表格
 */
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
    title: 'APP ID',
    dataIndex: 'app_info_id',
    disabled: false,
  },
  {
    title: '截图图片URL',
    dataIndex: 'image',
    disabled: false,
  },
  {
    title: '适用平台',
    dataIndex: 'platform',
    disabled: false,
    customRender: ({text}) => ({"ios":"iOS","android":"安卓"}[text])
  },
  {
    title: '排序（升序）',
    dataIndex: 'sort_order',
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
const getDataList = async (param) => {
  isLoading.value = true;
  try {
    const res = await index({ ...param, ...queryParams });
    localDataSource.value = res.data.data;
    return res.data;
  } finally {
    isLoading.value = false;
  }
}
const handleRefresh = (bool = false) => {
  table.value.refresh(bool)
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
        item?.id || (selectedRowKeys.value=[])
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

const handleEdit = (record) => {
  if (!record && selectedRowKeys.value.length == 1) {
    record = localDataSource.value.filter(item => item.id === selectedRowKeys.value[0])[0]
  }
  if(!record){
    return ;
  }
  router.push({
    path: 'update',
    query: {
      id: record.id
    }
  })

}
const handleAdd = () => {
  router.push({
    path: 'add'
  })
}

const appInfoOptions = ref([]);
const appInfoQuery = reactive({});

function appInfoSelect(){
  appInfoSelectApi(appInfoQuery).then(res=>{
    appInfoOptions.value = res.data.data;
  })
};
const appInfoDebounce = debounce(appInfoSelect,800);
function appInfoSearch(value){
  appInfoQuery['search'] = value;
  appInfoDebounce();
};

onMounted(() => {
appInfoSelect();
})
</script>
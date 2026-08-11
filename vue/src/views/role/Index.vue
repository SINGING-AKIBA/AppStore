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
          <!-- 
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="isLoading" :disabled="isLoading"><SearchOutlined />{{ $t('search') }}</a-button>
            <a-button type="default" @click="searchFormReset"><ReloadOutlined />{{ $t('reset') }}</a-button>
          </a-form-item>-->
        </a-form>
      </a-row>
    </div>
    <a-row class='row-item-group'>
      <a-col :span="18" class="flex flex-row flex-start">
        <a-button type="dark" @click="handleRefresh">
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
    <div>
      <a-alert message="此处用于管理后台的管理员角色，对本页面数据进行更改时确认知晓作用,更改后无法修复" type="warning" showIcon></a-alert> 
    </div>

    <s-table 
      :columns="columns.filter(item => !item.disabled)" 
      :data="getDataList"
      :scroll="{ x: 'max-content' }"
      :pagination="false"
      ref="table" 
      rowKey="id"
    >
      <template #bodyCell="{ record, text, column, index }">
        <span v-if="column.dataIndex === 'permission'">
          <template v-for="item in text" :key="item.id">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleEdit(item)">{{ $t('edit') }}</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleDelete(item)">{{ $t('delete') }}</a>
                  </a-menu-item>
                </a-menu>
              </template>
              <a-tag>{{ item.meta.title }}</a-tag>
            </a-dropdown>
          </template>
        </span>
        <table-actions 
          v-if="column.dataIndex === 'actions'" 
          :data="record"
          :showView="false"
          @edit="handleEdit"
          @delete="handleDelete"
        >
        </table-actions>
      </template>
    </s-table>
    <add ref="addModalRef" @ok="handleRefresh" />
    <editModal ref="editModalRef" @ok="handleRefresh" />
  </a-card>
</template> 
<script setup>
import { ref, reactive,onMounted } from 'vue';
import { index, remove } from '@/api/Role';
import { Modal,message } from 'ant-design-vue';
import * as XLSX from 'xlsx';
import { useRoute ,useRouter} from 'vue-router';
import { useI18n } from 'vue-i18n';
import add from './modules/Add.vue';
import editModal from './modules/Edit.vue';
const addModalRef = ref(null);
const editModalRef = ref(null);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();


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
const historyData = ref([]);
const columns = ref([
  {
    title: '序列',
    dataIndex: 'id',
    disabled: false,
  },
  {
    title: '角色名称',
    dataIndex: 'name',
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
  return index({ ...param, ...queryParams }).then(response => {
      isLoading.value = false;
      let roles = response.data.map((v,k)=>{return {name:v,id:k+1}})
      localDataSource.value = roles;
      let data = {
        data: roles,
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: response.data.length,
      };
      return data
    })
}
const handleRefresh = (bool = false) => {
  table.value.refresh(bool)
}
const handleEdit = (record) => {
  if (!record && selectedRowKeys.value.length == 1) {
    record = localDataSource.value.filter(item => item.id === selectedRowKeys.value[0])[0]
  }
  if(!record){
    return ;
  }
  editModalRef.value.show(record.name)
}
const handleAdd = () => {
  addModalRef.value.show()
}
/**
 * 删除数据
 */
const handleDelete = (item) => {
  let name = item.name
  Modal.confirm({
    title: t('Friendly Reminder'),
    content: t('Are you sure you want to delete? This action cannot be undone!'),
    onOk: () => {
      remove(name).then(() => {
        message.success(t('Deletion successful.'))
        handleRefresh();
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
    localDataSource.value = historyData.value
    return
  }
  localDataSource.value = historyData.value.filter(item => {
    for (let key in item) {
      if ((typeof item[key] == 'string') || (typeof item[key] == 'number')) {
        let str = getCustomRenderResult(key, {text:item[key]} ) || item[key].toString();
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

onMounted(() => {
})

</script>
<style scoped>
.alert-wrapper {
  top: -20px;
}
</style>
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
        <a-form-item name="nick_name" label="用户昵称" >
          <a-input v-model:value="formData.nick_name" placeholder="请输入用户昵称" type="text" max="765" min="0"   />
        </a-form-item>
        <a-form-item name="gender" label="性别" >
          <a-select v-model:value="formData.gender" placeholder="请选择性别" mode="default" allowClear ><a-select-option :value="0">保密</a-select-option><a-select-option :value="1">男</a-select-option><a-select-option :value="2">女</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="platform" label="注册来源" >
          <a-select v-model:value="formData.platform" placeholder="请选择注册来源" mode="default" allowClear ><a-select-option value="H5">web</a-select-option><a-select-option value="APP">app</a-select-option><a-select-option value="MP-WEIXIN">微信小程序</a-select-option><a-select-option value="MP-ALIPAY">支付宝小程序</a-select-option><a-select-option value="MP-TOUTIAO">抖音小程序</a-select-option><a-select-option value="MP-QQ">QQ小程序</a-select-option><a-select-option value="MP-KUAISHOU">快手小程序</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="country" label="国家" >
          <a-input v-model:value="formData.country" placeholder="请输入国家" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="province" label="省份" >
          <a-input v-model:value="formData.province" placeholder="请输入省份" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="city" label="城市" >
          <a-input v-model:value="formData.city" placeholder="请输入城市" type="text" max="150" min="0"   />
        </a-form-item>
        <a-form-item name="points" label="用户积分" >
          <a-input-number v-model:value="formData.points" placeholder="请输入用户积分"   min="0"  />
        </a-form-item>
        <a-form-item name="mobile" label="用户手机号" >
          <a-input v-model:value="formData.mobile" placeholder="请输入用户手机号" type="text" max="60" min="0"   />
        </a-form-item>
        <a-form-item name="real_name" label="真实姓名" >
          <a-input v-model:value="formData.real_name" placeholder="请输入真实姓名" type="text" max="80" min="0"   />
        </a-form-item>
        <a-form-item name="grade_id" label="会员等级ID" >
          <a-select v-model:value="formData.grade_id" placeholder="请选择会员等级ID" mode="default" allowClear :filter-option="false" show-search @search="gradeSearch"><a-select-option v-for="item in gradeOptions" :key="item.value" :value="item.value">{{item.label}}</a-select-option></a-select>
        </a-form-item>
        <a-form-item name="last_login_time" label="最后登录时间" >
          <a-date-picker v-model:value="formData.last_login_time" format="YYYY-MM-DD" valueFormat="X" />
        </a-form-item>
        <a-form-item name="last_login_ip" label="最后登录IP" >
          <a-input v-model:value="formData.last_login_ip" placeholder="请输入最后登录IP" type="text" max="120" min="0"   />
        </a-form-item>
        <a-form-item name="status" label="用户状态" >
          <a-select v-model:value="formData.status" placeholder="请选择用户状态" mode="default" allowClear ><a-select-option :value="10">正常</a-select-option><a-select-option :value="20">拉黑</a-select-option></a-select>
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
        <a-button type="primary" @click="handleAdd()" v-permission="'user.add'">
          <PlusOutlined />
          {{ $t('add') }}
        </a-button>
        <a-button type="green" @click="handleEdit()" :disabled="selectedRowKeys.length !== 1"  v-permission="'user.update'">
          <EditOutlined />
          {{ $t('edit') }}
        </a-button>
        <a-button type="danger" @click="handleDelete()" :disabled="!selectedRowKeys.length" v-permission="'user.delete'">
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
        <div v-permission="'user.export'">
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
        <template v-if="item.column.dataIndex ==='avatar_img'" ><div class="table-image"><a-image  :width="45" :height="45" :src="item.record?.avatarImgList?.url" /></div></template>
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
import { index, remove } from '@/api/User';
import { ref, reactive,onMounted } from 'vue';
import { Modal,message } from 'ant-design-vue';
import { select as gradeSelectApi } from '@/api/Grade';


defineOptions({
  inheritAttrs: false,
  name: 'user.Index'
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
    title: 'ID',
    dataIndex: 'id',
    disabled: false,
    width: '80px',
  },
  {
    title: '用户昵称',
    dataIndex: 'nick_name',
    disabled: false,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    disabled: false,
    customRender: ({text}) => ({"0":"保密","1":"男","2":"女"}[text])
  },
  {
    title: '注册来源',
    dataIndex: 'platform',
    disabled: false,
    customRender: ({text}) => ({"H5":"web","APP":"app","MP-WEIXIN":"微信小程序","MP-ALIPAY":"支付宝小程序","MP-TOUTIAO":"抖音小程序","MP-QQ":"QQ小程序","MP-KUAISHOU":"快手小程序"}[text])
  },
  {
    title: '头像图片ID',
    dataIndex: 'avatar_img',
    disabled: false,
  },
  {
    title: '国家',
    dataIndex: 'country',
    disabled: false,
  },
  {
    title: '省份',
    dataIndex: 'province',
    disabled: false,
  },
  {
    title: '城市',
    dataIndex: 'city',
    disabled: false,
  },
  {
    title: '用户可用余额',
    dataIndex: 'balance',
    disabled: false,
  },
  {
    title: '用户积分',
    dataIndex: 'points',
    disabled: false,
  },
  {
    title: '用户手机号',
    dataIndex: 'mobile',
    disabled: false,
  },
  {
    title: '真实姓名',
    dataIndex: 'real_name',
    disabled: false,
  },
  {
    title: '会员等级ID',
    dataIndex: 'grade_id',
    disabled: false,
  },
  {
    title: '最后登录时间',
    dataIndex: 'last_login_time',
    disabled: false,
  },
  {
    title: '最后登录IP',
    dataIndex: 'last_login_ip',
    disabled: false,
  },
  {
    title: '用户状态',
    dataIndex: 'status',
    disabled: false,
    customRender: ({text}) => ({"10":"正常","20":"拉黑"}[text])
  },
  {
    title: '拉黑原因',
    dataIndex: 'message',
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

const gradeOptions = ref([]);
const gradeQuery = reactive({});

function gradeSelect(){
  gradeSelectApi(gradeQuery).then(res=>{
    gradeOptions.value = res.data.data;
  })
};
function gradeSearch(value){
  gradeQuery['search'] = value;
  debounce(gradeSelect(),800);
};

onMounted(() => {
gradeSelect();
})
</script>
<template>
  <a-card>
    <div class="statistics-header">
      <h1 class="title">🏆 三创赛美妆新零售实战赛 - 团队实战数据报告汇总</h1>
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-label">📊 总团队数</div>
          <div class="stat-value">{{ summaryData.total_teams || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">📹 短视频总数</div>
          <div class="stat-value">{{ summaryData.total_videos || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">🎥 直播总场次</div>
          <div class="stat-value">{{ summaryData.total_lives || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">💰 GMV 总额</div>
          <div class="stat-value">¥{{ formatMoney(summaryData.total_gmv) }}</div>
        </div>
      </div>
    </div>

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
        <a-form-item name="name" label="团队名称" >
          <a-input v-model:value="formData.name" placeholder="请输入团队名称" type="text" max="150" min="0"   />
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
        <a-button type="primary" :loading="exportAllLoading" @click="handleExportAll">
            <FilePdfOutlined /> 一键生成全部报告
          </a-button>
          <a-button type="link" :loading="xlsxUploadLoading" @click="triggerXlsxUpload">
            <FilePdfOutlined /> 选择文件夹批量生成报告
          </a-button>
          <a-button type="link" :loading="singleFileLoading" @click="triggerSingleFileUpload">
            <FilePdfOutlined /> 选择文件生成报告
          </a-button>
          <input ref="xlsxInput" type="file" webkitdirectory directory accept=".xlsx,.xls" style="display: none" @change="handleXlsxUpload" />
          <input ref="singleFileInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleSingleFileUploadChange" />
          <a-progress v-if="xlsxUploadLoading" :percent="xlsxProgress" status="active" style="width: 200px; margin-left: 10px;" />
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
        <div v-permission="'statistics.export'">
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
          
          <a-progress v-if="exportAllLoading" :percent="exportProgress" status="active" style="width: 200px; margin-left: 10px;" />
        </div>
        <a-button type="default" @click="onShowSearch">
          <SearchOutlined />
        </a-button>
      </a-col>
    </a-row>
    <s-table 
      :columns="columns.filter(item => !item.disabled)" 
      :data="getDataList"
      :scroll="{ x: 'max-content' }"
      ref="table" 
      rowKey="id"
    >
      <template #bodyCell="item">
        <template v-if="item.column.dataIndex === 'name'">
          <a @click="handleDetail(item.record)">{{ item.record.name }}</a>
        </template>
        <template v-else-if="item.column.dataIndex === 'rating'">
          <a-tag :color="getRatingColor(item.text)">{{ item.text }}</a-tag>
        </template>
        <template v-else-if="item.column.dataIndex === 'actions'">
          <table-actions 
            :data="item.record"
            :showEdit="false"
            :showDelete="false"
            :view="handleVidews"
            @edit="handleDetail"
          >
            <a-button type="primary" @click="handlePdf(item.record)">
              生成报告
            </a-button>
          </table-actions>
        </template>
      </template>
    </s-table>
  </a-card>
</template> 
<script setup>
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { useI18n } from 'vue-i18n';
import { useRoute,useRouter } from 'vue-router';
import { SearchOutlined, ReloadOutlined, TableOutlined, DownloadOutlined, FilePdfOutlined } from '@ant-design/icons-vue';
import { statistics,exportData,getAll,exportPdfFromXls } from '@/api/index';
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';


defineOptions({
  inheritAttrs: false,
  name: 'statistics.Index'
})
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const formatMoney = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

const getRatingColor = (rating) => {
  const colorMap = {
    'A': 'green',
    'B': 'blue',
    'C': 'cyan',
    'D': 'geekblue',
    'E': 'purple',
    'F': 'magenta',
    'G': 'pink',

  };
  return colorMap[rating] || 'default';
}

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

const summaryData = reactive({
  total_teams: 0,
  total_videos: 0,
  total_lives: 0,
  total_gmv: 0
});

const table = ref(null);
const isLoading = ref(false);
const localDataSource = ref([]);
const exportAllLoading = ref(false);
const exportProgress = ref(0);
const exportTotal = ref(0);
const exportCurrent = ref(0);
const xlsxInput = ref(null);
const singleFileInput = ref(null);
const xlsxUploadLoading = ref(false);
const singleFileLoading = ref(false);
const xlsxProgress = ref(0);
const xlsxTotal = ref(0);
const xlsxCurrent = ref(0);

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    disabled: false,
    width: '80px',
  },
  {
    title: '团队信息',
    dataIndex: 'name',
    disabled: false,
    width: '200px',
  },
  {
    title: '官网团队ID',
    dataIndex: 'official',
    disabled: false,
    width: '150px',
  },
  {
    title: '短视频',
    dataIndex: 'videos',
    disabled: false,
    width: '100px',
  },
  {
    title: '直播',
    dataIndex: 'lives',
    disabled: false,
    width: '100px',
  },
  {
    title: 'GMV(元)',
    dataIndex: 'gmv',
    disabled: false,
    width: '150px',
  },
  {
    title: '评级',
    dataIndex: 'rating',
    disabled: false,
    width: '100px',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: '150px',
    disabled: false,
  }
]);

const getDataList = (param) => {
  isLoading.value = true;
  return statistics({ ...param, ...queryParams }).then(res => {
    isLoading.value = false;
    localDataSource.value = res.data.data || [];
    
    if (res.data.summary) {
      summaryData.total_teams = res.data.summary.total_teams || 0;
      summaryData.total_videos = res.data.summary.total_videos || 0;
      summaryData.total_lives = res.data.summary.total_lives || 0;
      summaryData.total_gmv = res.data.summary.total_gmv || 0;
    }
    return res.data;
  })
}


const handleRefresh = (bool = false) => {
  table.value.refresh(bool)
}

const getCustomRenderResult = (key, val) => {
  let column = columns.value.filter(item => item.dataIndex == key);
  if (column.length > 0 && typeof column[0].customRender == 'function') {
    return column[0].customRender(val)
  }
  return false;
}
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
const handleSelectColumns = (e) => {
    columns.value[e.key].disabled = !columns.value[e.key].disabled;
    e.preventDefault()
}

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

const handleDetail = (record) => {
  if (!record) {
    return ;
  }
  router.push({
    path: 'detail',
    query: {
      id: record.teams_id
    }
  })
}

const handlePdf = (record)=>{
    if (!record || (!record.id && !record.teams_id)) {
      message.error('无法获取团队信息')
      return
    }
    const teamId = record.id || record.teams_id
    exportData({ id:teamId }).then(res => {
      const data = res.data;
      const uint8Array = new Uint8Array(data.content.data);
      const blob = new Blob([uint8Array], {
        type: 'application/pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('导出成功')
    }).catch((e) => {
      console.log(e)
      message.error('导出失败')
    })
}

const handleExportAll = async () => {
  try {
    exportAllLoading.value = true;
    exportProgress.value = 0;
    
    const teamsRes = await getAll();
    const teams = teamsRes.data || [];
    exportTotal.value = teams.length;
    exportCurrent.value = 0;
    
    if (teams.length === 0) {
      message.warning('暂无团队数据');
      return;
    }
    
    for (const team of teams) {
      const teamId = team.id;
      try {
        const res = await exportData({ id: teamId });
        const data = res.data;
        const uint8Array = new Uint8Array(data.content.data);
        const blob = new Blob([uint8Array], {
          type: 'application/pdf'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(`导出团队 ${teamId} 失败:`, err);
      }
      
      exportCurrent.value++;
      exportProgress.value = Math.round((exportCurrent.value / exportTotal.value) * 100);
    }
    
    message.success('全部报告生成完成');
  } catch (e) {
    console.error('一键生成报告失败:', e);
    message.error('一键生成报告失败');
  } finally {
    exportAllLoading.value = false;
    exportProgress.value = 0;
  }
}

const triggerXlsxUpload = () => {
  xlsxInput.value.click();
};

const triggerSingleFileUpload = () => {
  singleFileInput.value.click();
};

const handleSingleFileUploadChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  const isValid = validExtensions.some(ext => fileName.endsWith(ext));

  if (!isValid) {
    message.error('请选择有效的 Excel 文件(.xlsx 或 .xls)');
    e.target.value = '';
    return;
  }

  try {
    singleFileLoading.value = true;

    const formData = new FormData();
    formData.append('file', file);
    const res = await exportPdfFromXls(formData);
    const data = res.data;
    const uint8Array = new Uint8Array(data.content.data);
    const blob = new Blob([uint8Array], {
      type: 'application/pdf'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', data.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success('报告生成成功');
  } catch (err) {
    console.error('生成报告失败:', err);
    message.error('生成报告失败');
  } finally {
    singleFileLoading.value = false;
    e.target.value = '';
  }
};

const handleXlsxUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const xlsxFiles = files.filter(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls'));
  if (xlsxFiles.length === 0) {
    message.error('文件夹中没有有效的 Excel 文件');
    e.target.value = '';
    return;
  }

  try {
    xlsxUploadLoading.value = true;
    xlsxProgress.value = 0;
    xlsxTotal.value = xlsxFiles.length;
    xlsxCurrent.value = 0;

    let successCount = 0;
    let failCount = 0;

    for (const file of xlsxFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await exportPdfFromXls(formData);
        const data = res.data;
        const uint8Array = new Uint8Array(data.content.data);
        const blob = new Blob([uint8Array], {
          type: 'application/pdf'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        successCount++;
        
      } catch (err) {
        console.error('生成 ' + file.name + ' 失败:', err);
        failCount++;
      }
      xlsxCurrent.value++;
      xlsxProgress.value = Math.round((xlsxCurrent.value / xlsxTotal.value) * 100);
    }

    if (failCount > 0) {
      message.warning('批量生成完成：成功 ' + successCount + ' 个，失败 ' + failCount + ' 个');
    } else {
      message.success('批量生成完成，共生成 ' + successCount + ' 个报告');
    }
  } catch (error) {
    console.error('批量生成报告失败:', error);
    message.error('批量生成报告失败');
  } finally {
    xlsxUploadLoading.value = false;
    xlsxProgress.value = 0;
    e.target.value = '';
  }
};


onMounted(() => {

})
</script>

<style scoped>
.statistics-header {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.stats-summary {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  min-width: 150px;
}

.stat-label {
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.filter {
  width: 200px;
}
</style>

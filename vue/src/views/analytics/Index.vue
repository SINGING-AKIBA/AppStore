<template>
  <a-card :bordered="false" class="analytics-page">
    <div class="page-heading">
      <div>
        <h2>数据统计</h2>
        <p>平台访问、应用表现、下载点击和搜索趋势。UV 为匿名访客估算。</p>
      </div>
      <div class="heading-actions">
        <a-range-picker
          v-model:value="dateRange"
          :allow-clear="false"
          :presets="datePresets"
          @change="loadDashboard"
        />
        <a-button :loading="loading" @click="loadDashboard">
          <ReloadOutlined /> 刷新
        </a-button>
        <a-button type="primary" @click="exportCsv">
          <DownloadOutlined /> 导出 CSV
        </a-button>
      </div>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" class="metric-grid">
        <a-col v-for="item in metricCards" :key="item.key" :xs="24" :sm="12" :xl="8">
          <a-card class="metric-card" :bordered="false">
            <div class="metric-top">
              <span>{{ item.label }}</span>
              <component :is="item.icon" class="metric-icon" />
            </div>
            <div class="metric-value">{{ formatNumber(overview[item.key]) }}</div>
            <div class="metric-note">{{ item.note }}</div>
          </a-card>
        </a-col>
      </a-row>

      <a-card class="section-card" title="访问与行为趋势" :bordered="false">
        <div ref="trendChartRef" class="trend-chart" />
      </a-card>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :xl="14">
          <a-card class="section-card" title="应用表现排行" :bordered="false">
            <a-table
              :columns="appColumns"
              :data-source="appRanking"
              :pagination="false"
              :row-key="record => record.app_info_id"
              size="middle"
              :locale="{ emptyText: '暂无应用统计数据' }"
            />
          </a-card>
        </a-col>
        <a-col :xs="24" :xl="10">
          <a-card class="section-card" title="热门搜索关键词" :bordered="false">
            <a-table
              :columns="keywordColumns"
              :data-source="keywords"
              :pagination="false"
              :row-key="record => record.keyword"
              size="middle"
              :locale="{ emptyText: '暂无搜索数据' }"
            />
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :xl="12">
          <a-card class="section-card" title="访问来源" :bordered="false">
            <a-table
              :columns="sourceColumns"
              :data-source="sourceStats.sources"
              :pagination="false"
              :row-key="record => record.source"
              size="middle"
              :locale="{ emptyText: '暂无来源数据' }"
            />
          </a-card>
        </a-col>
        <a-col :xs="24" :xl="12">
          <a-card class="section-card" title="运行平台与设备" :bordered="false">
            <a-table
              :columns="platformColumns"
              :data-source="sourceStats.platforms"
              :pagination="false"
              :row-key="record => record.platform + '-' + record.device_type"
              size="middle"
              :locale="{ emptyText: '暂无设备数据' }"
            />
          </a-card>
        </a-col>
      </a-row>
      <a-alert
        class="privacy-note"
        type="info"
        show-icon
        message="统计口径说明"
        description="下载量代表有效下载按钮点击次数，不代表下载完成或安装成功；UV 根据匿名访客标识估算，不包含第三方应用注册用户。"
      />
    </a-spin>
  </a-card>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { message } from "ant-design-vue";
import { ReloadOutlined, DownloadOutlined, EyeOutlined, UserOutlined, AppstoreOutlined, DownloadOutlined as DownloadIcon, SearchOutlined } from "@ant-design/icons-vue";
import * as analyticsApi from "@/api/Analytics";

defineOptions({ name: "analytics.Index" });

const loading = ref(false);
const dateRange = ref([dayjs().subtract(6, "day"), dayjs()]);
const overview = ref({
  app_count: 0,
  pv: 0,
  uv: 0,
  detail_views: 0,
  download_clicks: 0,
  search_count: 0,
});
const trend = ref([]);
const appRanking = ref([]);
const keywords = ref([]);
const sourceStats = ref({ sources: [], platforms: [] });
const trendChartRef = ref(null);
let trendChart = null;

const datePresets = [
  { label: "最近 7 天", value: () => [dayjs().subtract(6, "day"), dayjs()] },
  { label: "最近 30 天", value: () => [dayjs().subtract(29, "day"), dayjs()] },
  { label: "本月", value: () => [dayjs().startOf("month"), dayjs()] },
];

const metricCards = [
  { key: "app_count", label: "上架应用", note: "当前已上架应用总数", icon: AppstoreOutlined },
  { key: "pv", label: "页面访问 PV", note: "应用列表和详情页面访问次数", icon: EyeOutlined },
  { key: "uv", label: "匿名访客 UV", note: "按匿名访客标识去重", icon: UserOutlined },
  { key: "detail_views", label: "应用详情访问", note: "应用详情页访问次数", icon: EyeOutlined },
  { key: "download_clicks", label: "下载按钮点击", note: "每次有效点击计一次", icon: DownloadIcon },
  { key: "search_count", label: "搜索次数", note: "用户主动提交的搜索次数", icon: SearchOutlined },
];

const appColumns = [
  { title: "应用", dataIndex: "app_name", key: "app_name", ellipsis: true },
  { title: "详情访问", dataIndex: "detail_views", key: "detail_views", width: 110 },
  { title: "下载点击", dataIndex: "download_clicks", key: "download_clicks", width: 110 },
  {
    title: "点击率",
    dataIndex: "download_rate",
    key: "download_rate",
    width: 100,
    customRender: ({ text }) => text + "%",
  },
];

const keywordColumns = [
  { title: "关键词", dataIndex: "keyword", key: "keyword", ellipsis: true },
  { title: "搜索", dataIndex: "search_count", key: "search_count", width: 76 },
  { title: "无结果", dataIndex: "no_result_count", key: "no_result_count", width: 76 },
];

const sourceColumns = [
  { title: "来源", dataIndex: "source", key: "source", customRender: ({ text }) => sourceLabel(text) },
  { title: "访问 PV", dataIndex: "visits", key: "visits", width: 100 },
  { title: "匿名 UV", dataIndex: "uv", key: "uv", width: 100 },
];

const platformColumns = [
  { title: "运行平台", dataIndex: "platform", key: "platform" },
  { title: "设备", dataIndex: "device_type", key: "device_type" },
  { title: "访问 PV", dataIndex: "visits", key: "visits", width: 90 },
  { title: "匿名 UV", dataIndex: "uv", key: "uv", width: 90 },
];

const requestParams = computed(() => ({
  start_date: dateRange.value?.[0]?.format("YYYY-MM-DD"),
  end_date: dateRange.value?.[1]?.format("YYYY-MM-DD"),
}));

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(Number(value) || 0);
}

function sourceLabel(value) {
  return ({
    direct: "直接访问",
    search: "搜索引擎",
    external: "外部链接",
    share: "分享访问",
    unknown: "未知来源",
  })[value] || value || "未知来源";
}

function renderTrend() {
  if (!trendChartRef.value) return;
  if (!trendChart) trendChart = echarts.init(trendChartRef.value);

  trendChart.setOption({
    tooltip: { trigger: "axis" },
    legend: { top: 0, data: ["PV", "UV", "详情访问", "下载点击", "搜索"] },
    grid: { left: 18, right: 20, top: 42, bottom: 22, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: trend.value.map(item => item.date),
    },
    yAxis: { type: "value", minInterval: 1 },
    series: [
      { name: "PV", type: "line", smooth: true, data: trend.value.map(item => item.pv) },
      { name: "UV", type: "line", smooth: true, data: trend.value.map(item => item.uv) },
      { name: "详情访问", type: "line", smooth: true, data: trend.value.map(item => item.detail_views) },
      { name: "下载点击", type: "line", smooth: true, data: trend.value.map(item => item.download_clicks) },
      { name: "搜索", type: "line", smooth: true, data: trend.value.map(item => item.search_count) },
    ],
  }, true);
}

async function loadDashboard() {
  if (!dateRange.value?.[0] || !dateRange.value?.[1]) return;
  loading.value = true;
  try {
    const params = requestParams.value;
    const [overviewRes, trendRes, appsRes, keywordsRes, sourceRes] = await Promise.all([
      analyticsApi.overview(params),
      analyticsApi.trend(params),
      analyticsApi.appRanking(params),
      analyticsApi.searchKeywords(params),
      analyticsApi.sourceStats(params),
    ]);
    overview.value = overviewRes.data || overview.value;
    trend.value = trendRes.data || [];
    appRanking.value = appsRes.data || [];
    keywords.value = keywordsRes.data || [];
    sourceStats.value = sourceRes.data || { sources: [], platforms: [] };
    await nextTick();
    renderTrend();
  } catch (error) {
    console.error("[Analytics] 加载统计数据失败:", error);
    message.error("统计数据加载失败，请稍后重试");
  } finally {
    loading.value = false;
  }
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return '"' + text.replace(/"/g, '""') + '"';
}

function exportCsv() {
  const rows = [
    ["AppStore 数据统计", requestParams.value.start_date, requestParams.value.end_date],
    [],
    ["总览指标", "数值"],
    ["上架应用", overview.value.app_count],
    ["页面访问 PV", overview.value.pv],
    ["匿名访客 UV", overview.value.uv],
    ["应用详情访问", overview.value.detail_views],
    ["下载按钮点击", overview.value.download_clicks],
    ["搜索次数", overview.value.search_count],
    [],
    ["日期", "PV", "UV", "详情访问", "下载点击", "搜索"],
    ...trend.value.map(item => [item.date, item.pv, item.uv, item.detail_views, item.download_clicks, item.search_count]),
    [],
    ["应用", "详情访问", "下载点击", "点击率(%)"],
    ...appRanking.value.map(item => [item.app_name, item.detail_views, item.download_clicks, item.download_rate]),
    [],
    ["搜索关键词", "搜索次数", "无结果次数"],
    ...keywords.value.map(item => [item.keyword, item.search_count, item.no_result_count]),
  ];
  const csv = "\ufeff" + rows.map(row => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "appstore-analytics-" + requestParams.value.start_date + "-" + requestParams.value.end_date + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleResize() {
  trendChart?.resize();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  loadDashboard();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  trendChart?.dispose();
  trendChart = null;
});
</script>

<style scoped>
.analytics-page {
  min-height: 100%;
}

.page-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-heading h2 {
  margin: 0;
  color: #1f2a3d;
  font-size: 22px;
  font-weight: 700;
}

.page-heading p {
  margin: 6px 0 0;
  color: #8491a5;
  font-size: 13px;
}

.heading-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.metric-card {
  height: 100%;
  border: 1px solid #edf1f6;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(27, 47, 77, 0.035);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #7d8ba0;
  font-size: 13px;
}

.metric-icon {
  color: #7c9bc4;
  font-size: 17px;
}

.metric-value {
  margin-top: 12px;
  color: #203653;
  font-size: 28px;
  font-weight: 750;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.metric-note {
  margin-top: 7px;
  color: #a0aabb;
  font-size: 11px;
}

.section-card {
  margin-bottom: 16px;
  border: 1px solid #edf1f6;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(27, 47, 77, 0.035);
}

.trend-chart {
  width: 100%;
  height: 320px;
}

.privacy-note {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .heading-actions {
    width: 100%;
  }

  .trend-chart {
    height: 260px;
  }
}
</style>

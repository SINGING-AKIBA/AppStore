<template>
  <a-card :bordered="false" class="detail-card">
    <div class="cover-page">
      <div class="logo">🏆</div>
      <h1 class="cover-title">三创赛美妆新零售实战赛</h1>
      <p class="cover-subtitle">团队实战数据报告</p>
      
      <div class="info-box">
        <div class="info-item">
          <span class="info-label">团队 ID</span>
          <span class="info-value">{{ teamData.official }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">团队名称</span>
          <span class="info-value">{{ teamData.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">统计周期</span>
          <span class="info-value">{{ teamData.start_time }} - {{ teamData.end_time }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">报告生成时间</span>
          <span class="info-value">{{ teamData.created_at }}</span>
        </div>
      </div>
      
      <div class="cover-footer">
        <p>第十六届全国大学生三创赛美妆新零售实战赛</p>
        <p>数字 AI 产业赋能中心 技术支持</p>
        <p class="note">数据来源：抖音平台 | 快团团 | 三创好物</p>
        <p class="note">本报告仅包含原始参赛数据，评价工作由主体自行组织</p>
      </div>
    </div>

    <div class="content-page">
      <div class="page-header">
        <h2>📊 数据概览</h2>
        <p>Data Overview - 统计周期内累计数据</p>
      </div>
      
      <div class="dingtalk-card">
        <div class="dingtalk-card-header">
          <div class="dingtalk-card-title">
            <span>📈</span>
            <span>核心观测点数据</span>
          </div>
        </div>
        
        <div class="overview-grid">
          <div class="overview-item">
            <div class="label">📹 短视频/图文发布量</div>
            <div class="value">{{ overviewData.videos }}</div>
            <div class="unit">条</div>
          </div>
          <div class="overview-item">
            <div class="label">🎥 累计直播场次</div>
            <div class="value">{{ overviewData.lives }}</div>
            <div class="unit">场</div>
          </div>
          <div class="overview-item highlight">
            <div class="label">💰 累计交易额 (GMV)</div>
            <div class="value success">¥{{ formatMoney(overviewData.gmv) }}</div>
            <div class="unit">元</div>
          </div>
        </div>
        
        <div class="rating-box">
          <div class="rating-label">综合评级</div>
          <div class="rating-value">{{ teamData.rating }}级</div>
          <div class="rating-desc">{{ getRatingDesc(teamDatarating) }}</div>
        </div>
        
        <div class="data-note">
          <p><strong>📝 数据说明：</strong>以上数据为统计周期内该团队在所有平台（抖音、快团团、三创好物）的累计数据，数据来源于平台官方接口，截至报告生成时间。</p>
        </div>
      </div>
    </div>

    <div class="content-page">
      <div class="page-header">
        <h2>📹 短视频/图文发布明细</h2>
        <p>Short Video / Image-Text Publication Details</p>
      </div>
      
      <div class="dingtalk-card">
        <div class="dingtalk-card-header">
          <div class="dingtalk-card-title">
            <span>📅</span>
            <span>按周统计</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>周次</th>
                <th>时间范围</th>
                <th>发布数量</th>
                <th>目标值 (≥5 条)</th>
                <th>是否达标</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in data.weekly_data" :key="week.week" :class="{ highlight: index === data.weekly_data.length - 1 }">
                <td>第 {{ index+1 }} 周</td>
                <td>{{ week.start_date }} - {{ week.end_date }}</td>
                <td>{{ week.videos }}</td>
                <td>5</td>
                <td><span :class="['status-badge', week.videos_pass ? 'success' : 'danger']">{{ week.videos_pass ? '✅ 达标' : '❌ 未达标' }}</span></td>
              </tr>
              <tr class="total-row">
                <td colspan="2">合计</td>
                <td>{{ videoTotal }}</td>
                <td>{{ videoTargetTotal }}</td>
                <td><span :class="['status-badge', videoStatusBadge]">{{ videoStatusText }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="data-note">
          <p><strong>📝 说明：</strong>根据赛规，每周发布非同质化短视频≥5 条为周基准线。数据来源于抖音平台官方接口。</p>
        </div>
      </div>
    </div>

    <div class="content-page">
      <div class="page-header">
        <h2>🎥 有效直播场次明细</h2>
        <p>Live Streaming Details</p>
      </div>
      
      <div class="dingtalk-card">
        <div class="dingtalk-card-header">
          <div class="dingtalk-card-title">
            <span>📅</span>
            <span>按周统计</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>周次</th>
                <th>时间范围</th>
                <th>直播场次</th>
                <th>目标值 (≥2h)</th>
                <th>是否达标</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in data.weekly_data" :key="week.week" :class="{ highlight: index === data.weekly_data.length - 1 }">
                <td>第 {{ index+1 }} 周</td>
                <td>{{ week.start_date }} - {{ week.end_date }}</td>
                <td>{{ week.lives }}</td>
                <td>2</td>
                <td><span :class="['status-badge', week.lives_pass ? 'success' : 'danger']">{{ week.lives_pass ? '✅ 达标' : '❌ 未达标' }}</span></td>
              </tr>
              <tr class="total-row">
                <td colspan="2">合计</td>
                <td>{{ liveTotal }}</td>
                <td>{{ liveTargetTotal }}</td>
                <td><span :class="['status-badge', liveStatusBadge]">{{ liveStatusText }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="data-note">
          <p><strong>📝 说明：</strong>根据赛规，每周至少直播 1 次（≥2 小时）为周基准线。有效直播场次定义为单次直播时长≥2 小时。数据来源于抖音平台官方接口。</p>
        </div>
      </div>
    </div>

    <div class="content-page">
      <div class="page-header">
        <h2>💰 交易额 (GMV) 明细</h2>
        <p>Transaction Details</p>
      </div>
      
      <div class="dingtalk-card">
        <div class="dingtalk-card-header">
          <div class="dingtalk-card-title">
            <span>📅</span>
            <span>按周统计</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>周次</th>
                <th>时间范围</th>
                <th>交易额 (GMV)</th>
                <th>目标值 (≥300 元)</th>
                <th>是否达标</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in data.weekly_data" :key="week.week" :class="{ highlight: index === data.weekly_data.length - 1 }">
                <td>第 {{ index+1 }} 周</td>
                <td>{{ week.start_date }} - {{ week.end_date }}</td>
                <td>¥{{ formatMoney(week.gmv) }}</td>
                <td>¥300</td>
                <td><span :class="['status-badge', week.gmv_pass ? 'success' : 'danger']">{{ week.gmv_pass ? '✅ 达标' : '❌ 未达标' }}</span></td>
              </tr>
              <tr class="total-row">
                <td colspan="2">合计</td>
                <td>¥{{ formatMoney(gmvTotal) }}</td>
                <td>¥{{ gmvTargetTotal }}</td>
                <td><span :class="['status-badge', gmvStatusBadge]">{{ gmvStatusText }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="data-note">
          <p><strong>📝 说明：</strong>根据赛规，周 GMV 以 300 元为周基准线。订单数据来源于三创好物平台官方接口，仅统计已完成订单。</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <p>📄 报告版本：v2.0 &nbsp;|&nbsp; 生成时间：{{ teamData.created_at }}</p>
      <p>🏆 第十六届全国大学生三创赛美妆新零售实战赛</p>
      <p>🏢 数字 AI 产业赋能中心 技术支持</p>
      <p class="warning">⚠️ 本报告仅包含原始参赛数据，不涉及任何评价内容。评价工作由各参赛主体自行组织。</p>
    </div>
  </a-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { detail } from '@/api/index';
import { reactive, onMounted, computed } from 'vue';

defineOptions({
  inheritAttrs: false,
  name: 'statistics.Detail'
})

const { t } = useI18n();
const route = useRoute();

const formatMoney = (value) => {
  if (!value && value !== 0) return '0.00';
  return new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('zh-CN').format(value);
}

const getRatingDesc = (rating) => {
  const descMap = {
    "A": "有效达成比≥80%",
    "B": "有效达成比≥60%",
    "C": "有效达成比<60%",
  };
  return descMap[rating] || '';
}

const teamData = reactive({
  official: '',
  name: '',
  start_time: '',
  end_time: '',
  created_at: '',
  rating:''
});

const overviewData = reactive({
  videos: 0,
  lives: 0,
  gmv: 0,
});

const data = reactive({
  weekly_data: [],
});


const videoTotal = computed(() => data.weekly_data.reduce((sum, w) => sum + (w.videos || 0), 0));
const videoTargetTotal = computed(() => data.weekly_data.length * 5);
const videoAllPass = computed(() => data.weekly_data.every(w => w.videos_pass));
const videoPassCount = computed(() => data.weekly_data.filter(w => w.videos_pass).length);
const videoStatusBadge = computed(() => videoAllPass.value ? 'success' : (videoPassCount.value > 0 ? 'warning' : 'danger'));
const videoStatusText = computed(() => videoAllPass.value ? '✅ 全部达标' : (videoPassCount.value > 0 ? '⚠️ 部分达标' : '❌ 未达标'));

const liveTotal = computed(() => data.weekly_data.reduce((sum, w) => sum + (w.lives || 0), 0));
const liveTargetTotal = computed(() => data.weekly_data.length * 1);
const liveAllPass = computed(() => data.weekly_data.every(w => w.lives_pass));
const livePassCount = computed(() => data.weekly_data.filter(w => w.lives_pass).length);
const liveStatusBadge = computed(() => liveAllPass.value ? 'success' : (livePassCount.value > 0 ? 'warning' : 'danger'));
const liveStatusText = computed(() => liveAllPass.value ? '✅ 全部达标' : (livePassCount.value > 0 ? '⚠️ 部分达标' : '❌ 未达标'));

const gmvTotal = computed(() => data.weekly_data.reduce((sum, w) => sum + (w.gmv || 0), 0));
const gmvTargetTotal = computed(() => data.weekly_data.length * 300);
const gmvAllPass = computed(() => data.weekly_data.every(w => w.gmv_pass));
const gmvStatusBadge = computed(() => gmvAllPass.value ? 'success' : (data.weekly_data.some(w => w.gmv_pass) ? 'warning' : 'danger'));
const gmvStatusText = computed(() => gmvAllPass.value ? '✅ 全部达标' : (data.weekly_data.some(w => w.gmv_pass) ? '⚠️ 部分达标' : '❌ 未达标'));


onMounted(() => {
  if (route.query.id) {
    detail({ id: route.query.id }).then(res => {
      const d = res.data;
      teamData.official = d.official || '';
      teamData.name = d.name || '';
      teamData.start_time = d.start_time || '';
      teamData.end_time = d.end_time || '';
      teamData.created_at = d.created_at || '';
      teamData.rating = d.rating
      
      overviewData.videos = d.videos || 0;
      overviewData.lives = d.lives || 0;
      overviewData.gmv = d.gmv || 0;
      
      data.weekly_data = d.weekly_data || [];
    })
  }
})
</script>

<style scoped>
.detail-card {
  background: white;
  padding: 0;
}

.cover-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 40px;
  text-align: center;
  color: white;
  border-radius: 16px 16px 0 0;
  margin-bottom: 0;
}

.cover-page + .content-page {
  border-top: none;
  border-radius: 0;
}

.content-page + .content-page {
  border-top: 1px solid #e2e8f0;
  border-radius: 0;
}

.logo {
  font-size: 5em;
  margin-bottom: 25px;
}

.cover-title {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
}

.cover-subtitle {
  font-size: 1.4em;
  margin-bottom: 60px;
  opacity: 0.95;
}

.info-box {
  background: rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 35px;
  max-width: 550px;
  margin: 0 auto;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  font-size: 1.08em;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  opacity: 0.8;
}

.info-value {
  font-weight: 600;
}

.cover-footer {
  margin-top: 60px;
  padding-top: 35px;
  border-top: 2px solid rgba(255,255,255,0.3);
  opacity: 0.9;
  font-size: 0.95em;
}

.cover-footer p {
  margin: 8px 0;
}

.cover-footer .note {
  margin-top: 15px;
  font-size: 0.9em;
  opacity: 0.8;
}

.content-page {
  background: white;
  padding: 40px;
  margin-bottom: 0;
}

.page-header {
  text-align: center;
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 3px solid #4f46e5;
}

.page-header h2 {
  font-size: 1.75em;
  color: #4f46e5;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1em;
  color: #64748b;
}

.dingtalk-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.dingtalk-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.dingtalk-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25em;
  font-weight: 600;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin: 20px 0;
}

.overview-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.overview-item .label {
  font-size: 0.9em;
  color: #64748b;
  margin-bottom: 12px;
}

.overview-item .value {
  font-size: 2.3em;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 5px;
}

.overview-item .unit {
  font-size: 0.85em;
  color: #64748b;
}

.overview-item.highlight {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #0089ff;
}

.overview-item .value.success {
  color: #10b981;
}

.rating-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 20px 30px;
  text-align: center;
  margin: 25px 0;
}

.rating-box .rating-label {
  font-size: 0.95em;
  color: #92400e;
  margin-bottom: 10px;
}

.rating-box .rating-value {
  font-size: 3em;
  font-weight: 700;
  color: #92400e;
}

.rating-box .rating-desc {
  font-size: 0.9em;
  color: #78350f;
  margin-top: 10px;
}

.table-container {
  overflow-x: auto;
  margin: 18px 0;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
}

.data-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9em;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9em;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.data-table .highlight {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  font-weight: 600;
}

.data-table .total-row {
  background: #f0f9ff;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.data-note {
  background: #f8f9fa;
  border-left: 4px solid #4f46e5;
  padding: 15px 18px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.9em;
  color: #64748b;
}

.data-note p {
  margin: 0;
}

.page-footer {
  background: white;
  border-radius: 0 0 16px 16px;
  padding: 28px;
  text-align: center;
  color: #64748b;
  font-size: 0.9em;
}

.page-footer p {
  margin: 8px 0;
}

.page-footer .warning {
  color: #f59e0b;
  font-weight: 600;
}

@media (max-width: 768px) {
  .cover-page {
    padding: 50px 25px;
  }
  
  .cover-title {
    font-size: 1.7em;
  }
  
  .content-page {
    padding: 28px 22px;
  }
  
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
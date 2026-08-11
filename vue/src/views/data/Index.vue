<template>
  <BorderBox1 class="data-screen" @click="autoFullscreen">
    <div class="header">
      <div class="header-left">
        <div class="time">{{ formatTime(now) }}</div>
        <div class="date">{{ formatDate(now) }}</div>
      </div>
      <div class="header-center">
        <div>核心产业学院实时数据驾驶舱</div>
        <Decoration5 />
      </div>
      <div class="header-right">
        <div v-if="weather" class="weather">
          <div class="weather-temp">{{ weather.temp }}°C</div>
          <div class="weather-desc">{{ weather.desc }}</div>
          <div class="weather-humidity">湿度 {{ weather.humidity }}%</div>
        </div>
        <div v-else class="weather-loading">获取天气中...</div>
      </div>
    </div>

    <div class="dashboard-body">

      <div class="stats-row">
        <div class="stats-box">
          <div class="stat-item">
            <span class="stat-icon">🏫</span>
            <div class="stat-info">
              <div class="stat-label">合作院校/企业总数</div>
              <div class="stat-value">{{ stats.schools }}</div>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-icon">👥</span>
            <div class="stat-info">
              <div class="stat-label">团队总数</div>
              <div class="stat-value">{{ stats.teams }}</div>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-icon">🔗</span>
            <div class="stat-info">
              <div class="stat-label">第三方合作账号总数</div>
              <div class="stat-value">{{ stats.thirdApps }}</div>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-icon">🎬</span>
            <div class="stat-info">
              <div class="stat-label">视频数量</div>
              <div class="stat-value">{{ stats.videos }}</div>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-icon">📡</span>
            <div class="stat-info">
              <div class="stat-label">直播场次</div>
              <div class="stat-value">{{ stats.lives }}</div>
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <div class="stat-info">
              <div class="stat-label">总销售额</div>
              <div class="stat-value">{{ stats.sales }}</div>
            </div>
          </div>
        </div>
        <Decoration2 style='width: 100%; height: 1px; position: absolute; bottom:0px; left: 0;' />
      </div>


      <div class="body-columns">
        <div class="left-panel">
          <div class="panel-card scroll-panel">
            <ScrollRankTable />
          </div>
        </div>
        <div class="center-panel">
          <div class="panel-card map-card">
            <SchoolMap />
          </div>
        </div>
        <div class="right-panel">
          <div class="panel-card chart-card">
            <div class="panel-title">数字知产 — Nightingale Rose</div>
            <div ref="roseChartRef" class="rose-chart"></div>
          </div>
        </div>
      </div>

      <div class="bottom-row">
        <div class="bottom-left">
          <div class="panel-card metrics-card">
            <div class="panel-title">关键指标周环比</div>
            <div class="metrics-grid">
              <div
                v-for="m in metrics"
                :key="m.label"
                class="metric-item"
                :class="{ 'metric-negative': m.value < 0 }"
              >
                <div class="metric-label">{{ m.label }}</div>
                <div class="metric-value">{{ m.value > 0 ? '+' : '' }}{{ m.value }}%</div>
                <div class="metric-bar">
                  <div
                    class="metric-fill"
                    :style="{ width: Math.abs(m.value) * 2.5 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-right">
          <div class="panel-card chart-card">
            <div class="panel-title">近30天趋势 — Stacked Line</div>
            <div ref="lineChartRef" class="line-chart"></div>
          </div>
        </div>
      </div>
    </div>

  </BorderBox1>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { BorderBox1, Decoration5, Decoration2 } from '@dataview/datav-vue3';
import * as statsApi from '@/api/Stats';
import * as echarts from 'echarts';
import SchoolMap from './SchoolMap.vue';
import ScrollRankTable from './ScrollRankTable.vue';
// 统计数据
const stats = reactive({
  schools: 0,
  teams: 0,
  thirdApps: 0,
  videos: 0,
  lives: 0,
  sales: 0,
});

// 关键指标周环比（有正有负）
const metrics = reactive([
  { label: '比赛', value: 12.5 },
  { label: '课程', value: 8.3 },
  { label: '订单', value: 23.7 },
  { label: '用户', value: -5.2 },
  { label: '证书', value: 5.1 },
]);

const fetchMetrics = async () => {
  statsApi.metrics().then((res) => {
    metrics.splice(0, metrics.length, ...res.data);
  });
};

const fetchStats = async () => {
  statsApi.index().then((res) => {
    stats.schools = res.data.schools;
    stats.teams = res.data.teams;
    stats.thirdApps = res.data.thirdApps;
    stats.videos = res.data.videos;
    stats.lives = res.data.lives;
    stats.sales = res.data.sales;
  });
};

// Nightingale Rose Chart
const roseChartRef = ref(null);
const roseChartData = ref([])
let roseChartInstance = null;

const initRoseChart = () => {
  nextTick(() => {
    if (!roseChartRef.value) return;
    roseChartInstance = echarts.init(roseChartRef.value);

    const option = {
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      legend: {
        bottom: 0,
        textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      color: ['#00d4ff', '#00ff88', '#ffd700', '#ff6b6b', '#a78bfa'],
      series: [{
        type: 'pie',
        radius: ['20%', '75%'],
        center: ['50%', '45%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(10, 14, 39, 0.8)',
          borderWidth: 2,
        },
        label: {
          color: 'rgba(255,255,255,0.8)',
          fontSize: 11,
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          lineStyle: { color: 'rgba(255,255,255,0.2)' },
          smooth: true,
        },
        data: roseChartData.value,
      }],
    };

    roseChartInstance.setOption(option);
  });
};

const fetchRoseChart = () => {
  statsApi.roseChart().then((res) => {
    roseChartData.value = res.data;
    initRoseChart();
  })
};

// Stacked Line Chart
const lineChartRef = ref(null);
const lineChartData = ref([]);
const days = ref([])
let lineChartInstance = null;

const initLineChart = () => {
  nextTick(() => {
    if (!lineChartRef.value) return;
    lineChartInstance = echarts.init(lineChartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 14, 39, 0.85)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        textStyle: { color: '#fff', fontSize: 11 },
      },
      legend: {
        top: 0,
        textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8,
      },
      color: ['#00d4ff', '#00ff88', '#ffd700', '#ff6b6b', '#a78bfa'],
      grid: {
        left: '3%',
        right: '3%',
        bottom: '6%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: days.value,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
        axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed' } },
        axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
      },
      series: lineChartData.value,
    };

    lineChartInstance.setOption(option);
  });
};

const fetchLineChart = () => { 
  statsApi.lineChart().then((res) => { 
    lineChartData.value = res.data.series;
    days.value = res.data.days;
    initLineChart();
  });
};

// 实时时间
const now = ref(new Date());
let timer = null;

const formatTime = (date) => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const w = weekdays[date.getDay()];
  return `${y}年${m}月${d}日 星期${w}`;
};

// 天气信息
const weather = ref(null);

const fetchWeather = async () => {
  try {
    const res = await fetch('https://wttr.in/Guangzhou?format=j1');
    const data = await res.json();
    const current = data.current_condition[0];
    weather.value = {
      temp: current.temp_C,
      humidity: current.humidity,
      desc: current.weatherDesc[0].value,
    };
  } catch (e) {
    console.error('获取天气失败:', e);
  }
};

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
  fetchWeather();
  fetchStats();
  fetchRoseChart();
  fetchLineChart();
  fetchMetrics();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.data-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: #fff;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;

  .header {
    padding: 10px 24px;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      min-width: 160px;

      .time {
        font-size: 22px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
        background: linear-gradient(90deg, #00d4ff, #00ff88);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.2;
      }

      .date {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
      }
    }

    .header-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .Decoration5 {
        margin-top: 8px;
      }
    }

    .header-right {
      min-width: 160px;
      text-align: right;

      .weather {
        .weather-temp {
          font-size: 20px;
          font-weight: 600;
          color: #ffd700;
        }

        .weather-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-left: 6px;
        }

        .weather-humidity {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
        }
      }

      .weather-loading {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .dashboard-body {
    height: calc(100vh - 80px);
    padding: 0 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stats-row {
    position: relative;

    .stats-box {
      display: flex;
      align-items: stretch;
      background: rgba(0, 212, 255, 0.04);
      border-bottom: 1px solid rgba(0, 212, 255, 0.3);

      .stat-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 8px;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          background: rgba(0, 212, 255, 0.08);
          transform: translateY(-1px);

          .stat-value {
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
          }
        }

        .stat-icon {
          font-size: 20px;
          line-height: 1;
          opacity: 0.8;
          flex-shrink: 0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: text-shadow 0.3s ease;
        }
      }

      .stat-divider {
        width: 1px;
        min-height: 36px;
        align-self: center;
        background: linear-gradient(180deg,
            transparent,
            rgba(0, 212, 255, 0.3),
            transparent);
      }
    }
  }



  .body-columns {
    flex: 5;
    display: flex;
    gap: 10px;
    min-height: 0;
  }

  .left-panel {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .center-panel {
    flex: 4;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .right-panel {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .panel-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 14px;
    text-align: center;

    .panel-title {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 12px;
    }

    .panel-value {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(90deg, #00d4ff, #00ff88);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .scroll-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  .chart-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 8px 6px;
  }

  .map-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
    min-height: 0;
    overflow: hidden;
  }

  .rose-chart {
    flex: 1;
    width: 100%;
    min-height: 0;
  }

  .line-chart {
    flex: 1;
    width: 100%;
    min-height: 0;
  }

  .bottom-row {
    flex: 3.5;
    display: flex;
    gap: 10px;
    min-height: 0;
  }

  .bottom-left {
    flex: 3;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .bottom-right {
    flex: 7;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .metrics-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    text-align: left;
  }

  .metrics-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 6px;
  }

  .metric-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .metric-label {
      width: 32px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      flex-shrink: 0;
    }

    .metric-value {
      width: 44px;
      font-size: 12px;
      font-weight: 600;
      color: #00ff88;
      text-align: right;
      flex-shrink: 0;
    }

    .metric-bar {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #00d4ff, #00ff88);
      transition: width 0.6s ease;
    }

    &.metric-negative {
      .metric-value {
        color: #ff6b6b;
      }
      .metric-fill {
        background: linear-gradient(90deg, #ff6b6b, #ffd700);
      }
    }
  }
}

.fullscreen-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  padding: 4px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.fullscreen-btn:hover {
  color: #fff;
  background: rgba(0, 212, 255, 0.3);
}
</style>
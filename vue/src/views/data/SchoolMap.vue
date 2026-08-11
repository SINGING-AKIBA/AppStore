<template>
  <div class="school-map-wrap">
    <div class="map-body">
      <div class="map-header"><span class="map-title">合作院校/企业分布图</span></div>
      <div ref="mapRef" class="map-chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { geography } from '@/api/Schools'
import * as echarts from 'echarts'
const mapRef = ref(null)
let chartInstance = null
const schoolsData = ref([])
const loaded = ref(false)

const generateMockData = async () => {
  const res = await geography()
  schoolsData.value = res.data
}

const loadChinaMap = async () => {
  try {
    const resp = await fetch('/china-geo.json')
    const json = await resp.json()
    echarts.registerMap('china', json)
    return true
  } catch (e) {
    console.error('Failed to load China map GeoJSON:', e)
    return false
  }
}

const renderChart = () => {
  if (!mapRef.value) return
  chartInstance = echarts.init(mapRef.value, undefined, { renderer: 'canvas' })
  const values = schoolsData.value.map((d) => d.value)
  const minVal = Math.min(...values, 0)
  const maxVal = Math.max(...values, 1)

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,14,39,0.9)',
      borderColor: '#4a6cf7',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (p) => {
        if (!p.data) return `<div>${p.name}: 暂无学院</div>`
        const item = schoolsData.value.find(d => d.name === p.name) || p.data
        return `<div style="font-weight:700;font-size:15px;margin-bottom:4px">${p.name}</div>
                <div>学院数量: <span style="color:#4fc3f7;font-weight:700">${item.value||0}</span> 所</div>
                <div>覆盖城市: ${item.cityCount||0}</div>`
      },
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      text: ['高', '低'],
      left: 10,
      bottom: 20,
      calculable: true,
      inRange: { color: ['#1a237e', '#283593', '#1565c0', '#1976d2', '#42a5f5', '#64b5f6'] },
      textStyle: { color: '#9ea4c1' },
    },
    series: [
      {
        name: '合作院校/企业分布图',
        type: 'map',
        map: 'china',
        roam: true,
        label: { show: true, color: '#e8eaf6', fontSize: 10 },
        itemStyle: {
          borderColor: '#0a0e27',
          borderWidth: 1.5,
          areaColor: '#1a237e',
        },
        emphasis: {
          label: { color: '#fff', fontSize: 14 },
          itemStyle: { areaColor: '#4fc3f7' },
        },
        data: schoolsData.value,
      },
    ],
  })
}

watch(schoolsData, (val) => {
  if (chartInstance && val.length > 0 && loaded.value) {
    chartInstance.setOption({ series: [{ data: val }] })
  }
}, { deep: true })

onMounted(async () => {
  await generateMockData()
  const ok = await loadChinaMap()
  if (ok) {
    await nextTick()
    renderChart()
  }
  loaded.value = true
})

onUnmounted(() => {
  chartInstance?.dispose()
})
</script>

<style scoped lang="less">
.school-map-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}


.map-header {
  position: absolute;
  top: 16px;
  left: 40px;
  z-index: 10;
  display: flex;
  gap: 12px;
}

.map-title {
  font-size: 16px;
  font-weight: 700;
  color: #e8eaf6;
}

.map-subtitle {
  font-size: 12px;
  color: #9ea4c1;
}

.map-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.map-chart {
  flex: 1;
  height: 100%;
  min-height: 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.map-sidebar {
  width: 240px;
  flex-shrink: 0;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: #c5cae9;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  &:hover {
    background: rgba(79, 195, 247, 0.12);
  }
}

.rank {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #9ea4c1;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.name {
  width: 70px;
  font-size: 12px;
  color: #c5cae9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}

.count {
  width: 36px;
  font-size: 12px;
  color: #4fc3f7;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}

.bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #1565c0, #4fc3f7);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.sidebar-empty {
  color: #9ea4c1;
  font-size: 12px;
  text-align: center;
  padding: 40px 0;
}
</style>
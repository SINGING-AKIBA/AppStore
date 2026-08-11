<template>
  <div class="scroll-rank-table">
    <Decoration7 style="width:100%; height:30px;">周排行数据</Decoration7>
    <div class="table-header">
      <span class="col-id">#</span>
      <span class="col-week">日期</span>
      <span class="col-team">团队</span>
      <span class="col-amount">订单总金额</span>
    </div>
    <div class="table-body" ref="scrollRef">
      <div class="scroll-wrap" :style="{ transform: `translateY(-${scrollOffset}px)` }">
        <div
          class="table-row"
          v-for="(row, index) in displayData"
          :key="row.id + '-' + index"
        >
          <span class="col-id">{{ row.id }}</span>
          <span class="col-week">{{ row.year_week }}</span>
          <span class="col-team">{{ row.teams?.name || '-' }}</span>
          <span class="col-amount">{{ formatAmount(row.total_order_amount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { index } from '@/api/CompetitionWeeklyRank';
import { Decoration7 } from '@dataview/datav-vue3';

const scrollRef = ref(null);
const scrollOffset = ref(0);
const dataList = ref([]);
let timer = null;

const displayData = computed(() => {
  // 重复数据3份以实现无缝滚动
  return [...dataList.value, ...dataList.value, ...dataList.value];
});

const formatAmount = (val) => {
  if (val === null || val === undefined) return '100.00';
  return Number(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fetchData = async () => {
  try {
    const res = await index({ page: 1, pageSize: 10,orderBy:{total_order_amount: 'desc'} });
    dataList.value = res.data.data || [];
  } catch (e) {
    console.error('获取竞赛周排行数据失败:', e);
  }
};

const startScroll = () => {
  if (dataList.value.length === 0) return;
  const rowHeight = 36;
  const totalHeight = dataList.value.length * rowHeight;

  timer = setInterval(() => {
    scrollOffset.value += 1;
    // 滚动到一份完整数据的高度后重置
    if (scrollOffset.value >= totalHeight) {
      scrollOffset.value = 0;
    }
  }, 40);
};

onMounted(() => {
  fetchData().then(() => {
    startScroll();
  });
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped lang="less">
.scroll-rank-table {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;

    .Decoration3 {
      width: 3px;
      height: 16px;
    }
  }

  .table-header {
    display: flex;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    margin-bottom: 4px;

    .col-id { width: 10%; text-align: center; }
    .col-week { width: 30%; text-align: center; }
    .col-team { flex: 1; text-align: center; }
    .col-amount { width: 28%; text-align: right; padding-right: 8px; }
  }

  .table-body {
    flex: 1;
    overflow: hidden;
    position: relative;

    .scroll-wrap {
      transition: none;
    }

    .table-row {
      display: flex;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      height: 36px;
      align-items: center;

      &:hover {
        background: rgba(0, 212, 255, 0.06);
      }

      .col-id { width: 10%; text-align: center; }
      .col-week { width: 30%; text-align: center; }
      .col-team {
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 4px;
      }
      .col-amount {
        width: 28%;
        text-align: right;
        padding-right: 8px;
        color: #00ff88;
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }
    }
  }
}
</style>
<template>
  <a-card class="card">
    <a-row v-for="(i) in info" :key="i.key">
      <div class="title">{{ i.title }}</div>
      <div class="list">
        <a-table :columns="i.key == 'server' ? columns2 : columns" :data-source="i.value" :pagination="false">
          <template #bodyCell="{ text, record, index, column }">
            <div v-if="column.dataIndex == 'status'">
              <CheckOutlined v-if="text == 'normal'" :style="{color:'green'}"/>
              <a-popover v-else>
                <template #content>
                  {{ text }}
                </template>
                <CloseOutlined :style="{color:'#ff0000'}"/>
              </a-popover>
            </div>
          </template>
        </a-table>
      </div>
    </a-row>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { index } from '@/api/Environment';

let columns = ref([
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '值',
    dataIndex: 'value'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
]);
let columns2 = ref([
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '值',
    dataIndex: 'value'
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
]);

const info = ref([]);

const getEnvInfo = () => {
    index().then((res) => {
    info.value = res.data;
  });
}
onMounted(() => {
  getEnvInfo();
});

</script>

<style scoped>
.title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  width: 100%;
  border-bottom: 1px solid #eef1f5;
  position: relative;
}

.title:before {
  content: "";
  position: absolute;
  width: 4px;
  height: 16px;
  background: #46a6ff;
  top: 4px;
  left: 0px;
}

.list {
  width: 100%;
  margin-bottom: 10px;
}
</style>

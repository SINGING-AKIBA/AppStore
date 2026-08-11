<template>
  <div class="wrapper">
    <a-collapse :default-active-key="defaultActiveKey" :bordered="false" expand-icon-position="right">
      <a-collapse-panel v-for="group in components" :key="group.key" :header="group.name">
        <div class="list">
          <div
            v-for="(item, index) in group.data"
            :key="index"
            class="item"
            @click="handleClick(item.type)"
          >
          <svg class="icon" >
              <use :xlink:href="'#icon-'+item.icon"></use>
          </svg>
            <span class="title">{{ item.name }}</span>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// 定义组件数据
const components = [
  {
    name: '媒体组件',
    key: 'media',
    data: [
      { name: '视频', type: 'video', icon: 'video' },
      { name: '文章', type: 'article', icon: 'order' },
      { name: '轮播图', type: 'banner', icon: 'banner' },
      { name: '图片橱窗', type: 'window', icon: 'window' },
      { name: '图片', type: 'image', icon: 'image' },
    ],
  },
  {
    name: '内容组件',
    key: 'store',
    data: [
      { name: '搜索框', type: 'search', icon: 'search' },
      { name: '公告', type: 'notice', icon: 'notice' },
      { name: '导航', type: 'navBar', icon: 'navBar' },
      { name: '短剧', type: 'videoList', icon: 'goods' },
      { name: '分类', type: 'category', icon: 'category' },
    ],
  },
  {
    name: '其他组件',
    key: 'other',
    data: [
      { name: '富文本', type: 'richText', icon: 'richText' },
      { name: '辅助线', type: 'guide', icon: 'guide' },
    ],
  },
];

// 计算默认展开的面板
const defaultActiveKey = computed(() => components.map(item => item.key));

// 点击事件处理函数
const handleClick = (type) => {
  emit('handleClick', type);
};

// 使用 defineEmits 来定义自定义事件
const emit = defineEmits(['handleClick']);
</script>
  <style lang="less" scoped>
  .wrapper {
    width: 350px;
    background: #f8f9fa;
  
    :deep(.ant-collapse-header){
      padding: 14px 16px;
      font-size: 13px;
      font-weight: 700;
      color: #595961;
    }
  
    :deep(.ant-collapse-content-box) {
      padding-top: 0 !important;
    }
  
    :deep(.ant-collapse > .ant-collapse-item ){
      border-bottom: none;
    }
  
    .list {
      display: flex;
      flex-wrap: wrap;
    }
  
    .item {
      width: 100px;
      height: 90px;
      padding: 15px 0;
      text-align: center;
      font-size: 12px;
      color: #595961;
      line-height: 20px;
      position: relative;
      user-select: none;
  
      &:hover {
        background: #f2f1f1;
        border-radius: 4px;
      }
      .icon{
        display: block;
        margin: 0 auto;
        width: 75px;
        height: 50px;
        line-height: 50px;
        font-size: 26px;
        color: #9797a1;
      }
    }
  }
  </style>
  
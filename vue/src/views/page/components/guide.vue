<template>
    <div class="guide" 
      :style="{ 
        padding: itemStyle.paddingTop + 'px 0px', 
        background: itemStyle.background 
      }"
    >
    <div class="line" 
      :style="{
        borderTopWidth: itemStyle.lineHeight + 'px',
        borderTopColor: itemStyle.lineColor,
        borderTopStyle: itemStyle.lineStyle
      }"
    >
    </div>
  </div>
  </template>
  <script setup>
  const props = defineProps({
    itemStyle: Object
  })
  </script>
  
  <style lang="less" scoped>
  .guide{
    box-sizing: border-box;
    .line{
        width: 100%;
    }
  }
  </style>
  
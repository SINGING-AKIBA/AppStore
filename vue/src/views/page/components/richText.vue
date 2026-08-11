<template>
    <div class="wrapper" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}">
      <div :style="{background:itemStyle.background}">
        <div v-html="content" :style="{backgroundColor:itemStyle.background}"></div>
      </div>
    </div>
  </template>
  <script setup>
    const props = defineProps({
      itemStyle: Object,
      content: String
    })
  </script>
  
  <style lang="less" scoped>
  .wrapper{
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    img{
      max-width: 100%;
    }
  }
  </style>
  
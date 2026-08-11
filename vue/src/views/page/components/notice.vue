<template>
    <div class="notice" :style="{ paddingTop: itemStyle.paddingTop + 'px', paddingBottom: itemStyle.paddingTop + 'px' }">
      <div padding="5px" :style="{backgroundColor:itemStyle.background,color:itemStyle.color}">
        <strong>
          <svg class="icon" >
              <use xlink:href="#icon-notice"></use>
          </svg>
        </strong>
        <div class="scroll-container">
          <div class="scroll">{{ params.text }}</div>
        </div>
      </div>
    </div>
  </template>
  <script setup>  
   const props = defineProps({
      itemStyle: Object,
      params: Object
    })
  </script>
  <style lang="less" scoped>
   .notice {
        display: flex;
        width: 100%;
        white-space: nowrap;
        align-items: center;
        .icon{
          height: 24px;
          width: 24px;
        }
        .scroll-container {
          display: inline-block;
          width: 610px;
          overflow: hidden;
          white-space: nowrap;
          box-sizing: border-box;
          .scroll{
            display: inline-block;
            padding-left: 100%;
            animation: scroll-left 15s linear infinite;
          }
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
    }
</style>
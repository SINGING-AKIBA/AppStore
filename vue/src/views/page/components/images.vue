<template>
  <div class="diy-image" :style="{ paddingBottom: `${itemStyle.paddingTop}px`,background: `${itemStyle.background}`}">
    <div class="item-image" v-for="(item,index) in data" :key="index" :style="{padding:`${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px 0px ${itemStyle.paddingLeft}px`}">
      <div class="link">
        <img class="image" :src="item.imgUrl" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data:Array,
  itemStyle:Object,
})
</script>

<style lang="less">
.diy-image{
 .item-image{
  .link{
    .image{
      width: 100%;
    }
  }
 }
}
</style>
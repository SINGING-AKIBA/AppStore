<template>
    <a-carousel :autoplay="itemStyle.autoplay">
        <div class="carousel" v-for="(item,index) in data" :key="index">
            <img :src="item.url" :style="{height:itemStyle.height+'px',borderRadius:itemStyle.radius+'px'}" />
        </div>
    </a-carousel>
</template>

<script setup>
    const props = defineProps({
        data:Array,
        itemStyle:Object
    })
</script>

<style lang="less" scoped>

.carousel{
    img{
        width: 100%;
    }
}
</style>
<template>
    <div class="video-box" :style="{ padding: `${itemStyle.paddingTop}px 0px`, }">
        <div :class="{background: itemStyle.background}">
            <video class="video" :style="{ height: `${itemStyle.height}px` }" :src="params.videoUrl" :poster="params.poster" :autoplay="params.autoplay == 1" controls></video>
        </div>
    </div>
</template>
<script setup>
const prop = defineProps({
    itemStyle: Object,
    params: Object
})
</script>

<style lang="less" scoped>
.video-box{
    .video{
        width: 100%;
        display: block;
    }
}
</style>
  
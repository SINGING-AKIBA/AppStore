<template>
    <div>
        <div :style="{'width':`${width}px`,'height':`${height}px`}" @click="handleZoom" class="image-zoom"></div>
        <a-modal
        :width="600"
        :open="visible"
        :maskClosable="true"
        @cancel="handleCancel"
        :footer="null"
        :bodyStyle="{padding:0,background:'black'}"
        :centered="true"
        destroyOnClose
        >
        <video controls class="video">
            <source :src="video" type="video/mp4">
            您的浏览器不支持Video标签。
        </video>
        </a-modal>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    const props = defineProps({
        src: {
            type: [String,Object],
            default: ''
        },
        width: {
            type: Number,
            default: 50
        },
        height: {
            type: Number,
            default: 50
        },
    })
    const video = ref(props.src.url ? props.src.url :  props.src);
    const visible = ref(false);
    const handleZoom = ()=>{
        visible.value = true;
    }
    const handleCancel = ()=>{
        visible.value = false;
    }
</script>

<style lang="less" scoped>
.image-zoom {
    background: no-repeat center center / 100%;
    cursor: pointer;
    background-image: url('@/assets/video.png');
}
.video{
    width:100%;
    height: 400px;
    background: black;
}
</style>
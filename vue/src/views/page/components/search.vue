<template>
    <div class="search" :style="{backgroundColor:itemStyle.background}">
        <a-input :style="{backgroundColor:itemStyle.inputBgColor}" :placeholder="data.placeholder"></a-input>
    </div>
</template>

<script setup>
    const props = defineProps({
        itemStyle:Object,
        data:Object
    })
</script>

<style lang="less" scoped>
.search{
    padding: 10px;
    .ant-input{
        border-radius: 32px;
    }
}
</style>    
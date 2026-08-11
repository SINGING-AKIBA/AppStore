<template>
    <div class="scroll-box">
        <div class="scroll">
            <div v-for="(item, index) in data" :key="index" class="item">
                {{item.name}}
            </div>
        </div>
        <div class="icon">
            <UnorderedListOutlined />
        </div>
    </div>
    
</template>
<script setup>
    import { UnorderedListOutlined } from '@ant-design/icons-vue';
    const props = defineProps({
        data:Object,
    })

</script>
<style lang="less" scoped>
.scroll-box{
    width: 100%;
    display: flex;
    .scroll{
        width: 305px;
        overflow-y: hidden;
        overflow-x: scroll;
        display: flex;
        .item{
            
            white-space: nowrap;
            padding: 10px;
            font-size: 14px;
        }
        &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        }

       &::-webkit-scrollbar-thumb {
        border-radius: 0px;
        background-color: #bdbdbd;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, .1);
        }
    }
    .icon{
        display: flex;
        width: 30px;
        padding-top: 3px;
        justify-content: end;
        align-items: center;
    }
}
</style>
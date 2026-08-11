<template>
    <div class="wrapper" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`,backgroundColor:itemStyle.background}">
        <div class="item" :class="'col-'+itemStyle.col" v-for="(item,index) in props.data" :key="index">
            <div class="icon">
                <img :class="{shape:itemStyle.shape =='circle'}" :src="item.image ? item.image : '/logo.png'" >  
            </div>
            <div class="grid-text">{{ item.title }}</div>
        </div>
    </div>  
</template>
<script setup>
const props = defineProps({
    itemStyle:Object,
    data:Object
})
</script>

<style lang="less" scoped>
    .col-3{
        width: 33.3333333%;
    }
    .col-4{
        width: 25%;
    }
    .col-5{
        width: 20%;
    }
    .wrapper{
        margin-bottom: 10px;
        overflow: hidden;
        .item{
            display: block;
            float: left;
            overflow: hidden;
            box-sizing: border-box;
            .grid-text {
                height: 20px;
                font-size: 14px;
                color: #909399;
                padding: 5px 0 10px 0rpx;
                box-sizing: border-box;
                text-align: center;
            }
            .icon{
                height: 50px;
                width: 100%;
                padding-top:10px;
                text-align: center;
                img{
                    width: auto;
                    height: 100%;
                }
                img.circle{
                    width: 50px;
                    border-radius: 50px;
                }
            }
        }
    }
</style>
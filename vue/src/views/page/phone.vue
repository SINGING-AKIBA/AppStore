<template>
  <div class="phone-wrapper">
    <div class="phone">
        <div class="phone-body">
            <div class="header">
                <div class="text">中国移动</div>
                <div class="icon">
                    <WifiOutlined />
                </div>
            </div>
            <div class="title">{{title}}</div>
            <div class="content">
                <draggable
                    v-model="props.modelValue"
                    item-key="index"
                    @update="handelDragItem"
                    v-bind="{ animation: 120, filter: '.undrag' }"
                >   
                    <template #item="{element,index}">
                        <div class="draggable" :key="index" @click="onEditor(index)" :class="{active:selectIndex == index}">
                            <!-- 搜索框 -->
                            <search 
                            v-if="element.key == 'search'"
                            :itemStyle="element.itemStyle"
                            :data="element.data"
                            />


                            <scrollCategory 
                            v-if="element.key == 'category' "
                            :itemStyle="element.itemStyle"
                            :data="element.data.list"
                            />


                            <slide 
                            v-if="element.key == 'banner' " 
                            :itemStyle="element.itemStyle"
                            :data="element.data.list"
                            />


                            <grid 
                            v-if="element.key == 'navBar' "
                            :itemStyle="element.itemStyle"
                            :data="element.data.list"
                            />


                            <images 
                            v-if="element.key == 'image' " 
                            :itemStyle="element.itemStyle"
                            :data="element.data.list"
                            />


                            <notice 
                            v-if="element.key == 'notice' " 
                            :params="element.data" 
                            :itemStyle="element.itemStyle" 
                            />


                            <richText 
                            v-if="element.key == 'richText' " 
                            :itemStyle="element.itemStyle" 
                            :content="element.data.content" 
                            />


                            <window  
                            v-if="element.key == 'window' " 
                            :itemStyle="element.itemStyle" 
                            :data="element.data.list"
                            />


                            <diyVideo 
                            v-if="element.key == 'video'" 
                            :params="element.data"
                            :itemStyle="element.itemStyle"
                            />

                            <articleList 
                            v-if="element.key == 'article' " 
                            :params="element.data" 
                            />

                            <videoList 
                            v-if="element.key == 'videoList' "  
                            :params="element.data" 
                            />

                            <guide 
                            v-if="element.key == 'guide' "  
                            :itemStyle="element.itemStyle"
                            />

                            <span class="delete" @click="deleteItem(index)">删除</span>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import {search,scrollCategory,slide,grid,images,notice,richText,diyVideo,guide,window,videoList,articleList} from './components/index.js';
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { WifiOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['deleteItem','onEditor'])
const props = defineProps({
    'modelValue':Array,
    selectIndex:{
        type:Number,
    }
})
const title = ref('SMILE PLAY');
function deleteItem(index){
    emit('deleteItem',index)
}
function onEditor(index){
    emit('onEditor',index)
}
function handelDragItem(e){
    emit('onEditor',e.newIndex)
}
</script>

<style lang="less" scoped>
@bg-color: #f8f9fa;
.phone-wrapper{
    .phone{
        width: 400px;
        height: 820px;
        background-image:url("@/assets/iPhone.svg");
        position: relative;
        overflow: hidden;
        .phone-body{
            position:absolute;
            border-radius: 30px;
            top: 15px;
            left:22px;
            width: 356px;
            height: 785px;
            overflow: hidden;
        }
        .header{
            
            color: #000;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            .text{
                width: 80px;
                float: left;
                text-align: center;
                background-color: @bg-color;
            }
            .icon{
                width: 80px;
                float: right;
                text-align: center;
                background-color: @bg-color;
            }
        }
        .title {
            font-weight: bold;
            text-align: center;
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            clear: both;
            background-color:@bg-color;
        }
        .content{
            width:100%;
            height: 705px;
            padding-left: 5px;
            padding-right: 5px;
            padding-bottom: 50px;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .content::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        }

        .content::-webkit-scrollbar-thumb {
        border-radius: 0px;
        background-color: #bdbdbd;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, .1);
        }
        /**图片 */
        .image{
            img{
                width: 100%;
                height: auto;
            }
        }
        .draggable{
            position: relative;
            cursor: move;
            min-height: 20px;
            &:hover{
                border: 1px dotted #000;
            }
            .delete{
                position:absolute;
                bottom: 0;
                right: 0;
                padding: 5px;
                background-color:rgba(0, 0, 0, .5);
                color: #c3c3c6;
                z-index:999;
                cursor: pointer;
                display: none;
            }
            
        }
        .active{
            border: 1px dotted #000;
            .delete{
                display: block;
            }
        }
    }
}

</style>
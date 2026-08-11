<template>
    <div>
        <draggable
            v-model="selectedItems"
            item-key="id"
            :component-data="{name:'file-list',type:'transition'}"
            @start="drag=true"
            @end="drag=false"
            @update="onChange"
        >
            <template #item="{element,index}">
                <div
                    class="file-item"
                    :style="{ width: `${width}px`, height: `${width}px` }"
                >
                    <a-image :src="element.url || element" :height="width" />
                    <DeleteOutlined class="close" @click="handleDeleteFileItem(index)"/>
                </div>
            </template>
        </draggable>
        <div
            v-if="(!multiple && selectedItems.length <= 0) || (multiple && selectedItems.length < maxNum)"
            class="selector"
            :style="{width: `${width}px`, height: `${width}px`}"
            title="点击选择图片"
            @click="handleSelectImage"
            >
            <PlusOutlined class="icon-plus" :style="{ fontSize: `${width * 0.5}px` }"/>
        </div>
        <FilesModal 
            ref="FileModal"
            :multiple="multiple"
            :maxNum="maxNum"
            :selectedNum="selectedItems.length"
            :type="10"
            @handleSubmit="handleSubmit"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import {cloneDeep} from 'lodash'
const props = defineProps({
    modelValue:{
        type: [Array, Number,String],
        default: () => ([])
    },
    multiple:{
        type: Boolean,
        default: false,
    },
    width:{
        type: Number,
        default: 80
    },
    maxNum:{
        type: Number,
        default: 100
    },
    defaultList:{
        type: Array,
        default:()=>([])
    },
    getUrl:{//默认获取的是ID 为true时返回的是图片地址
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue','change']);
const selectedItems = ref([]);
const allowProps = ref(true);
const FileModal = ref(null);
const handleSelectImage = () =>{
    FileModal.value.show();
}

const handleSubmit = (list)=>{
    if(!props.multiple){
        selectedItems.value = [list[0]];
    }else{
        selectedItems.value = selectedItems.value.concat(list);
    }
    onChange();
}
// 删除文件
const handleDeleteFileItem = (index) => {
    selectedItems.value.splice(index, 1)
    if (selectedItems.value.length === 0) {
        allowProps.value = false;
    }
    onChange();
}
const onChange = ()=>{
    if (selectedItems.value.length <= 0) {
        emit('update:modelValue', props.multiple ? [] : 0);
        emit('change', props.multiple ? [] : 0);
        return 
    }
    let val = '';
    if(!props.multiple){
        //单图
        if(props.getUrl){
            val = typeof selectedItems.value[0] === 'string' ? selectedItems.value[0] : (selectedItems.value[0].url || selectedItems.value[0].cover_url);
        }else{
            val = typeof selectedItems.value[0] === 'string' ? selectedItems.value[0] : selectedItems.value[0].id;
        }
    }else{
        val = selectedItems.value.map(item=>{
            if(props.getUrl){
                return typeof item === 'string' ? item : (item.url || item.cover_url);
            }else{
                return typeof item === 'string' ? item : item.id;
            }
        })
    }
    emit('change', val, selectedItems.value);
    emit('update:modelValue', val);
}
watch(() => props.defaultList, (val) => {
    if (val.length && selectedItems.value.length === 0 && allowProps.value) {
        selectedItems.value = cloneDeep(val);
        onChange();
    }
}, { immediate: true });
</script>

<style lang="less" scoped>
    .file-item{
        position: relative;
        float: left;
        border: 1px solid #e2e2e2;
        text-align: center;
        color: #dad9d9;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        margin-bottom: 10px;
        .img-cover{
            display: block;
            width: 100%;
            height: 100%;
            background: no-repeat center center / 100%;
        }
        &:hover{
            .close{
                display: block;
            }
        }
        .close {
            display: none;
            position: absolute;
            z-index: 1000;
            top: -8px;  
            right: -8px;
            cursor: pointer;
            font-size: 16px;
            color: #ff0000;
            &:hover {
            color: #ff0000;
            }
        }
    }
    .selector{
        float: left;
        border: 1px dashed #e2e2e2;
        text-align: center;
        color: #dad9d9;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
            border: 1px dashed #40a9ff;
            color: #40a9ff;
        }
    }
</style>

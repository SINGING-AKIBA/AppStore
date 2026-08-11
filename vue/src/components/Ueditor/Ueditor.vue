<template>
    <div>
      <!-- 富文本编辑器 -->
      <VueUeditorWrap
        ref="ueditorRef"
        v-model="content"
        :config="myConfig"
        @before-init="addCustomButton"
      />
      <!-- 文件选择器 -->
      <files-modal ref="filesModalRef" :multiple="true" @handleSubmit="handleSelectImageSubmit" />
    </div>
  </template>
  <script setup>
  import { ref, watch } from 'vue'
  import _ from 'lodash'
  import { defaultConfig } from './config'

  defineOptions({
    inheritAttrs: false,
    name: 'ueditor'
  })
  // 定义 props
  const props = defineProps({
    modelValue: {
        type:String,
        default:''
    },
    config: {
        type:Object,
        default:()=> ({})
    }
  })
  
  // 定义 emit
  const emit = defineEmits(['update:modelValue'])
  
  // 合并默认配置与传入配置
  const myConfig = _.merge(defaultConfig, props.config)
  
  // 定义响应式数据
  const content = ref(props.modelValue || '')
  const ueditorRef = ref(null)
  const filesModalRef = ref(null)
  
  // 监听 props.value 变化
  watch(() => props.modelValue, (val) => {
    if (val !== content.value) {
      content.value = val
    }
  }, { immediate: true })
  
  // 监听 content 变化，并发射事件更新父组件的值
  watch(content, (newVal) => {
    // 使用setTimeout防止热更新时报错
    setTimeout(() => {
      emit('update:modelValue', newVal)
    }, 10)
  })
  
  let editorInstance = null;
  // 方法定义
  const addCustomButton = (editorId) => {
    const app = { handleSelectImage }
    window.UE.registerUI('simpleupload', function (editor, uiName) {
      editorInstance = editor
      var btn = new window.UE.ui.Button({
        name: uiName,
        title: '插入图片',
        cssRules: '',
        onclick: () => {
          app.handleSelectImage()
        }
      })
      return btn
    }, undefined, editorId)
  }
  
  const handleSelectImage = () => {
    filesModalRef.value.show()
  }
  
  const handleSelectImageSubmit = (selectedItems) => {
    if (selectedItems.length > 0) {
      const content = selectedItems.map(item => `<p><img src="${item.url}"/></p>`).join('')
      inserthtml(content)
    }
  }
  
  const inserthtml = (content) => {
    editorInstance.execCommand('inserthtml', content)
  }
  </script>
  
  <style>
  .edui-default .edui-editor-toolbarboxinner {
    line-height: 12px !important;
  } 
  pre {
    overflow: hidden;
  }
  </style>
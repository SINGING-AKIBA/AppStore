<template>
  <a-modal 
    :title="title"
    :width="860"
    :open="visible"
    :loading="isLoading"
    :mask-closable="false"
    :destroy-on-close="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="isLoading">
      <div class="content">
        <div class="group">
          <div class="tree">
            <a-directory-tree
              :tree-data="groupList" 
              default-expand-all 
              :field-names="{children:'children', title:'name', key:'id' }"
              @select="groupSelect"
            />
          </div>
          <div class="footer"><a-button type="link" @click="showAddGroup">新增分组</a-button></div>
        </div>
        <div class="files">
          <div class="header">
            <div class="left">
              <a-input-search
                placeholder="搜索文件名称"
                @search="onSearch"
                style="width: 200px;"
              />
            </div>
            <div class="right">
              <span class="upload-desc">大小不能超过{{ uploadSize }}M</span>
              <a-upload
                name="iFile"
                accept="image/*,video/mp4"
                :before-upload="beforeUpload"
                :custom-request="onUpload"
                :multiple="true"
                :show-upload-list="false"
              >
                <a-button><upload-outlined></upload-outlined>上传</a-button>
              </a-upload>
            </div>
          </div>
          <div class="list">
            <ul v-if="fileList.length" class="file-list-box">
              <li
                class="file-item"
                :class="{ active: selectedKey.includes(item.id) }"
                v-for="(item, index) in fileList"
                :key="index"
                @click="onSelectItem(item)"
              >
                <div v-if="item.type == 10" class="img-cover" :style="{backgroundImage: `url('${item.url}')`}"></div>
                <div v-else-if="item.type == 30" class="img-cover video"></div>
                <div v-else-if="item.type == 20" class="img-cover file"></div>
                <p class="file-name">{{ item.name }}</p>
                <div class="select-mask">
                  <CheckOutlined class="selected-icon"/>
                </div>
              </li>
            </ul>
            <a-empty v-else-if="!isLoading" />
          </div>
          <div class="page">
            <a-pagination
              size="small"
              v-model:current="current_page"
              :total="total"
              :default-page-size="15"
              hide-on-single-page
              @change="handlePage"
            />
          </div>
        </div>
      </div>
    </a-spin>
    <AddGroup ref="addGroupRef" @onsubmit="getGroupList" />
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import * as uploadApi from '@/api/Upload';
import * as fileApi from '@/api/File';
import AddGroup from './AddGroup.vue';
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  maxNum: {
    type: Number,
    default: 100
  },
  selectedNum: {
    type: Number,
    default: 0
  },
  /**
   * 文件类型(10图片 20附件 30视频)
   */
  type: {
    type: Number,
    default: 0
  },
  title:{
      type:String,
      default:'文件管理'
  }
});

const emit = defineEmits(['handleSubmit']);

const visible = ref(false);
const isLoading = ref(false);
const groupList = ref([]);
const selectGroupId = ref(0);
const queryParam = reactive({
  channel: 20,
  page: 1,
  type: props.type > 0 ? props.type : null,
  name:''
});
let fileList = ref([]);
let selectedFile = ref([]);
let selectedKey = ref([]);
let current_page = ref(1);
let total = ref(0);
let uploadParams = ref('');
let uploading = ref([]);
const uploadSize = ref(2048);

const addGroupRef = ref(null);

const show = () => {
  visible.value = true;
  getGroupList();
  getUplaodConfig();
  getFileList();
};

const handleCancel = () => {
  visible.value = false;
  selectedFile.value = [];
  selectedKey.value = [];
};

const handleSubmit = () => {
  emit('handleSubmit', selectedFile.value);
  handleCancel();
};

// 获取分组信息
const getGroupList = async () => {
  const res = await fileApi.group();
  groupList.value = [{ id: 0, name: '全部分组' }].concat(res.data.data || []);
};

const showAddGroup = () => {
  addGroupRef.value.show();
};

// 点击分组
const groupSelect = (selectedKeys) => {
  const newSelect = selectGroupId.value !== selectedKeys[0];
  selectGroupId.value = selectedKeys[0];
  if (newSelect) {
    queryParam.page = 1;
    getFileList();
  }
};

// 获取文件列表
const getFileList = async () => {
  isLoading.value = true;
  try {
    const params = { ...queryParam };
    if (Number(selectGroupId.value) > 0) {
      params.group_id = selectGroupId.value;
    } else {
      delete params.group_id;
    }
    const res = await fileApi.index(params);
    current_page.value = res.data.current_page;
    total.value = res.data.total;
    fileList = res.data.data;
  } finally {
    isLoading.value = false;
  }
};

// 搜索文件
const onSearch = (val) => {
  queryParam.page = 1;
  queryParam.name = val
  getFileList();
};

// 获取文件上传配置
const getUplaodConfig = async () => {
  const res = await uploadApi.getConfig();
  uploadParams.value = res.data;
};

// 文件上传前校验
const beforeUpload = (file, fileList) => {
  if (fileList.length > 10) {
    message.error('最多同时上传10个文件');
    return false;
  }
  if ((file.size / 1024 / 1024) > uploadSize.value) {
    message.error(`文件大小不超过${uploadSize.value}M`);
    return false;
  }
  return true;
};

// 自定义上传
const onUpload = ({ file }) => {
  isLoading.value = true;
  uploading.value.push(true);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('group_id', selectGroupId.value);
  uploadApi.upload(formData, uploadParams.value)
    .finally(() => {
      uploading.value.pop();
      if (uploading.value.length === 0) {
        getFileList();
      }
    });
};

// 分页
const handlePage = (page) => {
  queryParam.page = page;
  getFileList();
};

// 选择文件
const onSelectItem = (item) => {
  const that = { id: item.id, url: item.url, type: item.type, cover_url: item.cover_url, duration: item.duration || 0 };
  if (!props.multiple) {
    selectedFile.value = [that];
    selectedKey.value = [that.id];
    return;
  }

  const selected = selectedFile.value.some(file => file.id === item.id);
  if (!selected && (selectedFile.value.length + props.selectedNum) >= props.maxNum) {
    message.warning(`最多可选${props.maxNum}个文件`, 1);
    return;
  }

  if (!selected) {
    selectedFile.value.push(that);
    selectedKey.value.push(that.id);
  } else {
    selectedFile.value = selectedFile.value.filter(file => file.id !== item.id);
    selectedKey.value = selectedKey.value.filter(id => id !== that.id);
  }
};

defineExpose({ show });
</script>

<style lang="less" scoped>
:deep(.ant-modal-header),
:deep(.ant-modal-footer) {
  border: none;
}
:deep(.ant-modal-body) {
  padding: 6px;
}

:deep(.ant-empty) {
  padding: 120px 0;
}
:deep(.ant-tree) li ul {
  padding:0px;
}
.content{
  display: flex;
  height: 460px;
  user-select: none;
  .group{
    border-right: 1px solid #e6e6e6;
    height: 100%;
    width: 150px;
    .tree::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
        background-color: transparent;
    }

    .tree::-webkit-scrollbar-track
    {

        border-radius: 5px;
        background-color: transparent;
    }

    .tree::-webkit-scrollbar-thumb
    {
        border-radius: 5px;
        background-color: #bdbdbd;
    }
    .tree{
      height: 440px;
      overflow-x: auto;
      overflow-y:auto;
      :deep(.ant-tree) {
        display: inline-block;
        min-width: 100%;
        max-height: 440px;
        width: auto;
      }
    }
    .footer{
      text-align: center;
    }
  }
  .files{
    width: 675px;
    height: 100%;
    .header{
      width: 100%;
      height: 35px;
      .left{
        width:50%;
        float:left;
        padding-left: 20px;
      }
      .right{
        width:50%;
        float:left;
        text-align: right;
        padding-right: 20px;
      }
    }
    .list{
      height: 400px;
      .file-list-box{
        margin: 0;
        padding-left: 15px;
        height: 417px;
        .file-item {
          width: 110px;
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          padding: 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          float: left;
          margin: 8px;
          -webkit-transition: All 0.2s ease-in-out;
          -moz-transition: All 0.2s ease-in-out;
          -o-transition: All 0.2s ease-in-out;
          transition: All 0.2s ease-in-out;
          &:hover {
            border: 1px solid #16bce2;
          }
        }
        .file-item {
          // 文件名称
          .file-name {
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            padding:0px;
            margin: 0px;
          }
          // 预览图
          .img-cover {
            margin: 0 auto;
            width: 85px;
            height: 85px;
            background: no-repeat center center / 100%;
          }
          .video{
            background-image: url('@/assets/video.png')
          }
          .file{
            background-image: url('@/assets/file.png')
          }
          // 遮罩层(选中时)
          &.active .select-mask {
            display: block;
          }
          .select-mask {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.41);
            text-align: center;
            border-radius: 2px;
            .selected-icon {
              font-size: 26px;
              color: #fff;
              line-height: 122px;
              text-align: center;
            }
          }
        }
      }
    }
    .page{
      width: 100%;
      height: 35px;
      text-align: right;
      padding-right: 40px;
    }
  }
}
</style>
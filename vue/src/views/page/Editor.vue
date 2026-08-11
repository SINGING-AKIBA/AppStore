<template>
  <div class="editor-wrapper">
    <div class="title"> 
        {{ titles[data.key]}}
    </div>
    <!-- 视频 -->
    <div v-if="data.key == 'video'" class="editor-body">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box">
                <div class="tabs-title">数据设置</div>
                <div class="tabs-item">
                <span class="label">视频地址</span>
                <div class="item-content">
                  <select-video v-model="data.data.videoUrl" :defaultList="[{id:0,url:data.data.videoUrl}]" :width="100" :getUrl="true"/>
                  <div class="tips">仅支持.mp4格式的视频</div>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">视频封面</span>
                <div class="item-content">
                  <select-image v-model="data.data.poster" :defaultList="[{id:0,url:data.data.poster}]" :width="100" :getUrl="true" key="video_poster"/>
                  <div class="tips">建议封面图片尺寸与视频比例一致</div>
                </div>
              </div>  
            </div>
            <div class="tabs-box">
              <div class="tabs-title">播放设置</div>
              <div class="tabs-item">
                <span class="label">自动播放</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.data.autoplay">
                  <a-radio-button :value="1">开启</a-radio-button>
                  <a-radio-button :value="0">关闭</a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">
                <span>内容样式</span>
              </div>
              <div class="tabs-item">
                <span class="label">视频高度</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.height" :min="50" :max="400" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.height }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
    </div>
    <!-- 富文本 -->
    <div v-else-if="data.key == 'richText'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="文本内容">
            <Ueditor v-model:value="data.data.content" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>  
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" />
                </div>
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 辅助线 -->
    <div v-else-if="data.key == 'guide'" class="editor-body">
          
      <div class="tabs-box">
        <div class="tabs-title">组件样式</div> 
        
        <div class="tabs-item">
          <span class="label">线颜色</span>
          <a-radio-group buttonStyle="solid" v-model:value="data.itemStyle.lineStyle">
            <a-radio-button value="solid">实线</a-radio-button>
            <a-radio-button value="dashed">虚线</a-radio-button>
            <a-radio-button value="dotted">点状</a-radio-button>
            <a-radio-button value="double">双线</a-radio-button>
          </a-radio-group>
        </div>
        <div class="tabs-item">
          <span class="label">线高度</span>
          <div class="item-slider">
            <a-slider v-model:value="data.itemStyle.lineHeight" :min="0" :max="50" />
            <span class="unit-text">
              <span>{{ data.itemStyle.lineHeight }}</span>
              <span>像素</span>
            </span>
          </div>  
        </div>
        <div class="tabs-item">
          <span class="label">上下边距</span>
          <div class="item-slider">
            <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
            <span class="unit-text">
              <span>{{ data.itemStyle.paddingTop }}</span>
              <span>像素</span>
            </span>
          </div>
        </div><div class="tabs-item">
          <span class="label">线颜色</span>
          <div class="item-colorPicker">
            <a-input type="color" v-model:value="data.itemStyle.lineColor" />
          </div>
        </div>
        
        <div class="tabs-item">
          <span class="label">背景色</span>
          <div class="item-colorPicker">
            <a-input type="color" v-model:value="data.itemStyle.background" />
          </div>
        </div>
        
      </div>

    </div>
    <!-- 公告 -->
    <div v-else-if="data.key == 'notice'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box">
              <div class="tabs-title">公告文案</div>
              <a-textarea v-model:value="data.data.text"></a-textarea>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">文字颜色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.color" />
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" />
                </div>
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 搜索框 -->
    <div v-else-if="data.key == 'search'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box">
              <div class="tabs-title">提示语</div>
              <a-input v-model:value="data.data.placeholder"></a-input>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">输入框颜色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.inputBgColor" />
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" />
                </div>
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 图片 -->
    <div v-else-if="data.key == 'image'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box" v-for="(img,ik) in data.data.list" :key="ik">
              <div class="tabs-title">图片{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
              <div class="tabs-item">
                <span class="label">图片</span>
                <div class="item-content">
                  <select-image v-model="img.imgUrl" :defaultList="[{id:0,url:img.imgUrl}]" :width="80" :getUrl="true" :key="'image'+ik"/>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">链接</span>
                <div class="select-link">
                  <SLink v-model:value="img.link" />
                </div>

              </div>
            </div>
             <a-button type="default" shape="round" block @click="addListData('image')">新增数据</a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>  
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" />
                </div>
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 图片橱窗 -->
    <div v-else-if="data.key == 'window'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box" v-for="(img,ik) in data.data.list" :key="ik">
              <div class="tabs-title">图片{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
              <div class="tabs-item">
                <span class="label">图片</span>
                <div class="item-content">
                  <select-image v-model="img.imgUrl" :defaultList="[{id:0,url:img.imgUrl}]" :width="80" :getUrl="true" :key="'window'+ik"/>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">链接</span>
                <div class="select-link">
                  <SLink v-model:value="img.link" />
                </div>

              </div>
            </div>
             <a-button type="default" shape="round" block @click="addListData('window')">新增数据</a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">布局</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.itemStyle.layout">
                  <a-radio-button :value="2">2列</a-radio-button>
                  <a-radio-button :value="3">3列</a-radio-button>
                  <a-radio-button :value="4">4列</a-radio-button>
                  <a-radio-button :value="-1">橱窗</a-radio-button>
                </a-radio-group>
              </div>  
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>  
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" />
                </div>
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 轮播图 -->
    <div v-else-if="data.key == 'banner'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box" v-for="(img,ik) in data.data.list" :key="ik">
              <div class="tabs-title">图片{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
              <div class="tabs-item">
                <span class="label">图片</span>
                <div class="item-content">
                  <select-image v-model="img.url" :defaultList="[{id:0,url:img.url}]" :width="80" :getUrl="true" :key="'banner'+ik"/>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">链接</span>
                <div class="select-link">
                  <SLink v-model:value="img.link" />
                </div>
              </div>
            </div>
             <a-button type="default" shape="round" block @click="addListData('banner')">新增数据</a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">自动轮播</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.itemStyle.autoplay">
                  <a-radio-button :value="true">开启</a-radio-button>
                  <a-radio-button :value="false">关闭</a-radio-button>
                </a-radio-group>
              </div>  
              <div class="tabs-item">
                <span class="label">圆角</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.radius" :min="0" :max="30" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.radius }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">高度</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.height" :min="100" :max="500" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.height }}</span>
                    <span>像素</span>   
                  </span>
                </div>  
              </div>
              
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 导航栏 -->
    <div v-else-if="data.key == 'navBar'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box" v-for="(item,ik) in data.data.list" :key="ik">
              <div class="tabs-title">导航{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
              <div class="tabs-item">
                <span class="label">图标</span>
                <div class="item-content">
                  <select-image v-model="item.image" :defaultList="[{id:0,url:item.image}]" :width="80" :getUrl="true" :key="'nav_bar'+ik"/>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">名称</span>
                <a-input v-model:value="item.title" />
              </div>
              <div class="tabs-item">
                <span class="label">链接</span>
                <div class="select-link">
                  <SLink v-model:value="item.link" />
                </div>
              </div>
            </div>
             <a-button type="default" shape="round" block @click="addListData('navBar')">新增数据</a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="tabs-box">
              <div class="tabs-title">组件样式</div>
              <div class="tabs-item">
                <span class="label">每行数量</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.itemStyle.col">
                  <a-radio-button :value="3">3个</a-radio-button>
                  <a-radio-button :value="4">4个</a-radio-button>
                  <a-radio-button :value="5">5个</a-radio-button>
                </a-radio-group>
              </div>  
              <div class="tabs-item">
                <span class="label">图片形状</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.itemStyle.shape">
                  <a-radio-button value="square">方形</a-radio-button>
                  <a-radio-button value="circle">圆形</a-radio-button>
                </a-radio-group>
              </div>
              <div class="tabs-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="tabs-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model:value="data.itemStyle.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ data.itemStyle.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>  
              </div>
              <div class="tabs-item">
                <span class="label">背景色</span>
                <div class="item-colorPicker">
                  <a-input type="color" v-model:value="data.itemStyle.background" defaultColor=""/>
                </div>
              </div>
            </div>
             
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 分类 -->
    <div v-else-if="data.key == 'category'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box" v-for="(item,ik) in data.data.list" :key="ik">
              <div class="tabs-title">分类{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
              <div class="tabs-item">
                <span class="label">分类ID</span>
                <a-input v-model:value="item.id" />
              </div>
              <div class="tabs-item">
                <span class="label">分类名称</span>
                <a-input v-model:value="item.name" />
              </div>
            </div>
             <a-button type="default" shape="round" block @click="addListData('category')">新增数据</a-button>
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 短剧列表-->
    <div v-else-if="data.key == 'videoList'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box">
              <div class="tabs-item">
                <span class="label">数据获取方式</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.data.dataType">
                  <a-radio-button value="api">自动</a-radio-button>
                  <a-radio-button value="list">手动</a-radio-button>
                </a-radio-group>
              </div> 
            </div>
            <div class="tabs-box" v-if="data.data.dataType == 'api'">
              <div class="tabs-title">参数配置</div>
              <div class="tabs-item">
                <span class="label">加载更多</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.data.auto">
                  <a-radio-button :value="true">开启</a-radio-button>
                  <a-radio-button :value="false">关闭</a-radio-button>
                </a-radio-group>
              </div>
              <div class="tabs-item">
                <span class="label">显示分类</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.data.category">
                  <a-radio-button :value="true">显示</a-radio-button>
                  <a-radio-button :value="false">隐藏</a-radio-button>
                </a-radio-group>
              </div>
            </div>

            <div v-if="data.data.dataType == 'list'">
              <div class="tabs-box"  v-for="(item,ik) in data.data.list" :key="ik">
              <div class="tabs-title">短剧{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
                  <div class="tabs-item">
                    <div>{{ item.title }}</div>
                  </div>
                </div>
                <a-button type="default" shape="round" block @click="openSelectVideos">添加短剧</a-button>
            </div>
            
          </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 文章列表 -->
    <div v-else-if="data.key == 'article'" class="editor-body">
      <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="tabs-box">
              <div class="tabs-item">
                <span class="label">数据获取方式</span>
                <a-radio-group buttonStyle="solid" v-model:value="data.data.dataType">
                  <a-radio-button value="api">自动</a-radio-button>
                  <a-radio-button value="list">手动</a-radio-button>
                </a-radio-group>
              </div> 
            </div>
            <div v-if="data.data.dataType == 'list'">
              <div class="tabs-box"  v-for="(item,ik) in data.data.list" :key="ik">
              <div class="tabs-title">文章{{ ik+1 }}<a-button type="link" @click="delListData(ik)">删除</a-button></div>
                  <div class="tabs-item">
                    <div>{{ item.title }}</div>
                  </div>
                </div>
                <a-button type="default" shape="round" block @click="openSelectArticle">添加文章</a-button>
            </div>
          </a-tab-pane>
      </a-tabs>
    </div>
    <selectVideos ref="SVideo" @onChange="onChange"/>
    <selectArticle ref="SArticle" @onChange="onChange"/>
  </div>
</template>
<script setup> 
import { ref, onMounted, reactive } from 'vue';
import Ueditor from '@/components/Ueditor';
import SLink from '@/components/Link';
import selectVideos from './modules/selectVideo.vue';
import selectArticle from './modules/selectArticle.vue';
import defaultData from './data.js';
import _ from 'lodash';
import { watch } from 'vue';
const emit = defineEmits(['update:modelValue']);
// 定义 props
const props = defineProps({
  'modelValue': {
    type: Object,
    default: () => ({
      key: '',
      itemStyle: {},
      data: {}
    })
  }
});

const data = ref(_.cloneDeep(props.modelValue));
//监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    const newValueClone = _.cloneDeep(newValue);
    if (!_.isEqual(data.value, newValueClone)) {
      data.value = newValueClone;
    }
  },
  { deep: true }
);

// 初始化数据
const titles = reactive({
  video: '视频',
  article: '文章列表',
  banner: '轮播图',
  window: '图片橱窗',
  image: '图片',
  search: '搜索框',
  notice: '公告',
  navBar: '导航栏',
  goods: '短剧',
  category: '分类',
  richText: '富文本',
  guide: '辅助线'
});

// 引用子组件
const SArticle = ref(null);
const SVideo = ref(null);

// 添加列表数据
const addListData = (type) => {
  const newData = _.cloneDeep(defaultData[type].data?.list[0]);
  if(!data.value.data.list){
    data.value.data['list'] = [newData];
  }else{
    data.value.data.list.push(newData);
  }
};

// 删除列表数据
const delListData = (index) => {
  if(index < 1){return}
  data.value.data.list.splice(index, 1);
};

// 选择文章
const openSelectArticle = () => {
  SArticle.value.show();
};

// 选择视频
const openSelectVideos = () => {
  SVideo.value.show();
};

// 处理商品选择变化
const onChange = (list) => {
  data.value.data.list = data.value.data.list.concat(list);
};
//通知数据变更
watch(
  data.value,
  (newData) => {
    // 深度比较新旧数据，避免不必要的更新
    if (!_.isEqual(newData, props.modelValue)) {
      emit('update:modelValue', _.cloneDeep(newData));
    }
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
.editor-wrapper{
    width: 420px;
    min-height: 650px;
    padding: 20px;
    padding-bottom: 150px;
    background: #f8f9fa;
    .title {
        font-size: 14px;
        padding-bottom: 10px;
    }
    .editor-body{
      .tabs-box{
        border-radius: 5px;
        padding: 10px;
        margin: 0 auto 10px;
        background: #edf0f4;
        .tabs-title{
          line-height: 30px;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        }
        .tabs-item{
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          .label{
            display: block;
            line-height: 32px;
            white-space: nowrap;
            font-size: 12px;
            margin-right: 20px;

            &.value {
              max-width: 160px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
            }
          }
          .item-content{
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            .tips{
              padding-top: 5px;
              clear: both;
            }
          }
          .select-link{
            width:100%;
            clear: both;
          }
          
        }
      }
    }
}

.link,
.tips {
  font-size: 12px;
  font-weight: normal;
}

.link {
  letter-spacing: 1px
}

.tips {
  color: #a3a3a8;
}
.item-slider {
  width: 100%;
  display: flex;

  .ant-slider {
    flex: 1;
    margin: 10px;

    :deep(.ant-slider-rail) {
      background: #d5d5d6;
    }
  }
}


.unit-text {
  padding: 0 10px;
  line-height: 32px;
  font-size: 12px;
}

.item-colorPicker {
  position: relative;
  // 颜色选择组件
  .m-colorPicker {
    display: block;
    background-color: #ffffff;
    border: 1px solid #efefef;
    padding: 5px;
    width: 70px;

    :deep(.colorBtn) {
      cursor: pointer;
      width: 55px;
      height: 20px;
      border: 1px solid #000;
    }

    :deep(.box) {
      left: -150px;
      top: 35px;
    }
  }

}
.ant-tabs{
  overflow: inherit;
}

.ant-input[type="color"]{
  width: 50px;
}

</style>
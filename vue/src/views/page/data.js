export default {
  //视频
  video: {
    key: 'video',
    itemStyle: {
      paddingTop: '',
      background: '#000000',
      height: 200,
    },
    data: {
      videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400.mp4',
      autoplay: 0,//是否自动播放0否1是
      poster: '',//封面
    }
  },
  //文章
  article: {
    key: 'article',
    itemStyle: false,
    data: {
      list: [],
      dataType: 'api',//api 或者list
      query: { page: 1, size: 4 }
    }
  },
  //轮播图
  banner: {
    key: 'banner',
    itemStyle: {
      radius: 0,
      height: 200,
      autoplay: true
    },
    data: {
      list: [
        {
          url: '',
          link: {}
        }
      ],
    }
  },
  //图片橱窗
  window: {
    key: 'window',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '#F9F9F9',
      layout: -1,//布局-1橱窗 2列 3列 4列
      borderRadius: 0//圆角
    },
    data: {
      list: [
        {
          imgUrl: '',
          link: {}
        }
      ]
    }
  },
  //图片
  image: {
    key: 'image',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '#F9F9F9',
      borderRadius: 0//圆角
    },
    data: {
      list: [
        {
          imgUrl: '',
          link: {}
        }
      ]
    }
  },
  //搜索框
  search: {
    key: 'search',
    itemStyle: {
      background: '#F9F9F9',
      inputBgColor: '#ffffff',
    },
    data: {
      placeholder: '请输入关键词'
    }
  },
  //公告
  notice: {
    key: 'notice',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '#F9F9F9',
      color: '#000000'
    },
    data: {
      text: '这里是自定义公告内容'
    }
  },
  //导航栏
  navBar: {
    key: 'navBar',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '',
      border: false,
      col: 4,
      shape: 'square'
    },
    data: {
      list: [
        {
          image: '',
          title: '',
          link: {}
        }
      ]
    }
  },
  //短剧
  videoList: {
    key: 'videoList',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '#F9F9F9',
    },
    data: {
      list: [],
      dataType: 'api',
      query: {},
      auto:false,
      category:false
    }
  },
  //分类
  category: {
    key: 'category',
    itemStyle: false,
    data: {
      list: [
        {
          id: 1,
          name: ''
        }
      ]
    }
  },
  //富文本
  richText: {
    key: 'richText',
    itemStyle: {
      paddingTop: 0,
      paddingLeft: 0,
      background: '#F9F9F9',
    },
    data: {
      content: ''
    }
  },
  //辅助线
  guide: {
    key: 'guide',
    itemStyle: {
      paddingTop: 0,
      background: '#F9F9F9',
      lineHeight: 1,//线高
      lineColor: '',//线颜色
      lineStyle: 'solid'
    },
    data: {}
  }
}   
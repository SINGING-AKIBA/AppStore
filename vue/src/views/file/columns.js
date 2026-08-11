[
  {
    title: 'ID',
    dataIndex: 'id',
    disabled: false,
  },
  {
    title: '预览',
    dataIndex: 'cover_url',
    disabled: false,
    scopedSlots: {
      customRender: 'image',
    },
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    disabled: false,
  },
  {
    title: '分组',
    dataIndex: 'group',
    disabled: false,
    customRender: (v) => (v ? v.name : '未分组')
  },
  {
    title: '存储方式',
    dataIndex: 'storage',
    disabled: false,
    customRender: (v) => ({
      local: '本地',
      qiniu: '七牛云',
      aliyun: '阿里云',
      qcloud: '腾讯云',
    }[v])
  },
  {
    title: '上传来源',
    dataIndex: 'channel',
    disabled: false,
    customRender: (v) => ({
      10: '总后台',
      20: '管理后台',
      30: '客户端',
    }[v])
  },
  {
    title: '文件类型',
    dataIndex: 'type',
    disabled: false,
    customRender: (v) => ({
      10: '图片',
      20: '附件',
      30: '视频',
    }[v])
  },
  {
    title: '文件大小(KB)',
    disabled: false,
    dataIndex: 'size',
  },
  {
    title: '后缀',
    dataIndex: 'ext',
    disabled: false,
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
    disabled: false,
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'actions',
    fixed: 'right',
    disabled: false,
    scopedSlots: {
      customRender: 'action',
    }
  }
]
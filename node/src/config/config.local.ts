import { MidwayConfig } from '@midwayjs/core';
export default {
  keys: '384d4112-1dea-40f1-93e4-72d8d6842688',
  koa: {
    port: 7010,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'dowload',
        password: 's3dKy2mPJnDSBijW',
        database: 'dowload',
        synchronize: false,
        logging: false,
        charset: 'utf8mb4',
        cache: false,
        strict:false,
        entities: [
          '**/app/*/model/*.{j,t}s',
        ],
      }
    }
  },
  crud: {
    prefix: 'smile_',
    view_admin_path: 'C:\\SINGING\\download\\vue\\src',
    //默认 admin和common自动添加
    module: ['api'],
    // common的名称
    common_name: 'common',
    // admin的名称
    admin_name: 'admin',
    // 前端模板目录
    tpl_dir: 'vue3',
    /**
     * 表字段自动生成组件
     * 字符串方式： 例：图片 : 'img,images'
     * 数组方式： 例：选择框 : ['ids','fieldType':['enum','set']]
     */
    // 自动生成富文本编辑的后缀
    editor: {suffix:['editor', 'content'], fieldType: ['mediumtext', 'longtext']},
    // 自动生成时间选择的后缀
    date: {suffix:['date', 'time', 'datetime'], fieldType: ['date', 'time', 'datetime', 'year', 'timestamp']},
    // 自动生成视频上传的后缀
    video: {suffix:['video', 'videos'],fieldType:[]},
    // 自动生成图片上传的后缀
    image: {suffix:['image', 'images', 'avatar', 'img', 'imgs', 'icon', 'icons'],fieldType:[]},
    // 自动生成下拉框的后缀
    select: {suffix:['_ids', '_id', 'pid'], fieldType: ['set']},
    // 自动生成单选框的后缀
    radio: {suffix:['type', 'status'], fieldType: ['enum']},
    // 自动生成开关的后缀
    switch: {suffix:['switch'],fieldType:[]},
    // 自动生成复选框的后缀
    checkbox: {suffix:['checkbox'],fieldType:[]},
    // 自动生成文本域的后缀
    textarea: {suffix:['textarea', 'desc'], fieldType: ['text']},
    // 自动生成数字输入框的后缀
    inputNumber: {suffix:['number'], fieldType: ['int', 'bigint']},
    // 系统自动维护字段
    systemField: ['create_time', 'update_time', 'is_delete', 'delete_time', 'id'],
    // 父级字段
    parentFields: ['pid', 'parent_id', 'parent'],
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1",
      db:7,
    },
  },
} as MidwayConfig;

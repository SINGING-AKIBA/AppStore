import { MidwayConfig } from '@midwayjs/core';
import { Api } from '@/middleware/api';

export default {
  name: '用户模块',
  description: '小程序app接口模块',
  middleware: [Api],
  jwt: {
    // 注意： 最好重新修改，防止破解
    secret: '3gdse9dsd96f0-dddsdf-as3fs-dddsa-136619156bf',
    sign: {
      // 24小时过期，需要用刷新token
      expiresIn: 60 * 60 * 24 * 30,
      // 15天内，如果没操作过就需要重新登录
      refreshExpire: 60 * 60 * 24 * 60,
    },
  },
}

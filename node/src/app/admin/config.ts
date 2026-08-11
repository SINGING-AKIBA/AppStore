import { MidwayConfig } from '@midwayjs/core';
import { Admin } from '@/middleware/admin';

export default {
  name: '后台管理',
  description: '后台管理模块，用于后台的全部API功能',
  middleware: [Admin],
  jwt: {
    // 注意： 最好重新修改，防止破解
    secret: '5e9dsd96f0-dsdf-asdfs-dsa-136619156bf',
    sign: {
      // 24小时过期，需要用刷新token
      expiresIn: 60 * 60 * 24,
      // 15天内，如果没操作过就需要重新登录
      refreshExpire: 60 * 60 * 24 * 15,
    },
  },
}

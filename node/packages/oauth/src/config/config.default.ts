import { MidwayConfig } from '@midwayjs/core';

export const oauth: MidwayConfig['oauth'] = {
  wechat: {
    app: {
      appId: '',
      appSecret: '',
    },
    jsapi: {
      appId: '',
      appSecret: '',
    },
    h5: {
      appId: '',
      appSecret: '',
      returnUrl: '',
      appName: '',
    },
    mchId: '',
    apiKey: '',
    notifyUrl: '',
  },
  tiktok: {
    appId: '',
    appSecret: '',
    notifyUrl: '',
    returnUrl: '',
  },
  alipay: {
    appId: '',
    publicKey: '',
    privateKey: '',
    notifyUrl: '',
    quitUrl: '',
    returnUrl: '',
  },
  baidu: {
    appId: '',
    appSecret: '',
  },
  kuaishou: {
    appId: '',
    appSecret: '',
  },
};

export default {
  oauth,
} as MidwayConfig;

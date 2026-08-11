export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    oauth?: PowerPartial<{
      wechat: any;
      tiktok: any;
      alipay: any;
      baidu: any;
      kuaishou: any;
    }>;
  }
}

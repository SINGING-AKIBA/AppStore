export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    wecom?: PowerPartial<{
      agentId:string;
      secret:string;
      corpId:string;
    }>;
  }
}

export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    payment?: PowerPartial<{
      a: number;
      b: string;
    }>;
  }
}

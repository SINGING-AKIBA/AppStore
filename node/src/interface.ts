/**
 * @description User-Service parameters
 */
import '@midwayjs/core';
declare module '@midwayjs/core' {
  interface Context {
    user: any;
  }
}
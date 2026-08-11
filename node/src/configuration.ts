import { Configuration, App, IMidwayContainer, MidwayContainer,CommonJSFileDetector } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as crossDomain from '@midwayjs/cross-domain';
import * as casbin from '@midwayjs/casbin';
import * as jwt from '@midwayjs/jwt';
import * as validation from '@midwayjs/validation';
import * as info from '@midwayjs/info';
import * as staticFile from '@midwayjs/static-file';
import * as typeorm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as busboy from '@midwayjs/busboy';
import * as bullmq from '@midwayjs/bullmq';


import * as defaultConfig from './config/config.default';
import * as devConfig from './config/config.dev';
import * as prodConfig from './config/config.prod';
import * as localConfig from './config/config.local';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { RunTime } from './middleware/report';

@Configuration({
  imports: [
    koa,
    crossDomain,
    staticFile,
    typeorm,
    redis,
    validation,
    jwt,
    casbin,
    busboy,
    bullmq,
    {
      component: info,
      enabledEnvironment: ['local','dev'],
    },
    {
      component: swagger,
      enabledEnvironment: ['local','dev'],
    }
  ],
  importConfigs: [
    {
      default: defaultConfig,
      dev: devConfig,
      prod: prodConfig,
      local: localConfig,
    },
  ],
 detector: new CommonJSFileDetector(),
 
})
export class MainConfiguration {
  @App('koa')
  app!: koa.Application;

  async onReady(container: IMidwayContainer) {
    const appContainer = container as MidwayContainer;
    appContainer.bindClass(NotFoundFilter);
    appContainer.bindClass(DefaultErrorFilter);
    appContainer.bindClass(RunTime);
    this.app.useMiddleware([RunTime]);
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
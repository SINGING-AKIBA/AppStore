import { MidwayConfig } from '@midwayjs/core';
import joi from '@midwayjs/validation-joi';
import { uploadWhiteList, DefaultUploadFileMimeType } from '@midwayjs/busboy';
import { createAdapter } from '@midwayjs/casbin-typeorm-adapter';
import { SmileRules } from "@/app/common/model/SmileRules";
import * as path from 'path';

export default {
  keys: 'e472943d-c660-4815-97a0-014c0b853978',
  koa: {
    port: 7010,
    // 位于 nginx 之后，信任 X-Forwarded-* 头，ctx.protocol / ctx.ip 才会正确
    proxy: true,
  },
  validation: {
    validators: {
      joi,
    },
  },
  joi: {
    allowUnknown: true,
  },
  cors: {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
    origin: (req) => {
      return req.headers.origin;
    }
  },
  swagger: {
    title: 'smile admin',
    description: '项目接口文档',
    version: '1.0.0',
    auth: {
      name: 'authorization',
      authType: 'apikey',
      in: 'header',
      description: 'ApiKey Auth',
      addSecurityRequirements: true,
    },
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1",
      db: 9,
    },
  },
  busboy: {
    mode: 'file',
    whitelist:[...uploadWhiteList,'.xlsx','.xls','.csv','.apk','.wgt','.ppt','.pptx','.pdf','.txt'],
  },
  staticFile: {
    dirs: {
      default: {
        prefix: '/',
        dir: path.join(__dirname, '../../','public'),
      },
    }
  },
  bullmq: {
    defaultConnection: {
      host: '127.0.0.1',
      port: 6379,
    },
    defaultPrefix: 'smile_admin',
    defaultQueueOptions:{
      defaultJobOptions: {
        removeOnComplete: 300,
        removeOnFail: 1000,
      }
    },
  },
  // 阿里云短信
  dysms: {
    accessKeyId: '',
    accessKeySecret: '',
    signName: '',
  },
  dysmsGlobe:{
    accessKeyId: '',
    accessKeySecret: '',
    senderId: '',
    endpoint: '',
  },
  bailian: {
    appId: '',
    apiKey: '',
  },
  casbin: {
    modelPath: path.join(__dirname, '../../','basic_model.conf'),
    policyAdapter: createAdapter({
      dataSourceName: 'default',
      customCasbinRuleEntity: SmileRules as any,
    }),
  },
} as MidwayConfig;
import { MidwayConfig } from '@midwayjs/core';
import entities from "../entities";
export default {
  keys: '384d4112-1dea-40f1-93e4-72d8d6842688',
  koa: {
    port: parseInt(process.env.POST || '7010', 10),
    proxy: true,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'dowload',
        password: 'RHprHQyBF4ZFiGQG',
        database: 'dowload',
        synchronize: false,
        logging: false,
        strict:false,
        entities,
      }
    }
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1",
      db: 0,
    },
  }
} as MidwayConfig;

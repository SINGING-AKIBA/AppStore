import { MidwayConfig } from '@midwayjs/core';
export default {
  keys: '26fb75f2-1a2f-453e-bfdb-1e3acbc64689',
  koa: {
    port: 7010,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: '',
        password: '',
        database: '',
        synchronize: false,
        logging: false,
        entities: [
          '**/app/*/model/*.{j,t}s',
        ],
      }
    }
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1",
      db: 7,
    },
  }
} as MidwayConfig;

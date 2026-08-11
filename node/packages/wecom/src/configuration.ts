import { Configuration } from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';

@Configuration({
  namespace: 'wecom',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class WecomConfiguration {
  async onReady() {
    // TODO something
  }
}

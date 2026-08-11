import { Configuration } from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';

@Configuration({
  namespace: 'payment',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class PaymentConfiguration {
  async onReady() {
    // TODO something
  }
}

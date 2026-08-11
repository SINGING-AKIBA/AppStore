import { Configuration } from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';
import { OauthUser } from './entity/oauth-user.entity';

@Configuration({
  namespace: 'OAuth',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
  imports: [
    require('@midwayjs/typeorm').TypeORMFramework,
  ],
  entities: [OauthUser],
})
export class OAuthConfiguration {
  async onReady() {}
}

import { Provide } from '@midwayjs/decorator';
import { BaseDriver, Code2SessionResult, OAuthConfig } from './base.driver';

@Provide('wechatDriver')
export class WechatDriver extends BaseDriver {
  async code2session(param: string | { code: string; platform?: string }): Promise<Code2SessionResult> {
    const platform = typeof param === 'string' ? 'jsapi' : (param.platform || 'jsapi');
    const code = typeof param === 'string' ? param : param.code;

    if (!code) {
      this.setError('code cannot be empty');
      return { errcode: -1, errmsg: 'code cannot be empty' };
    }

    const appId = this.config[platform]?.appId || this.config.appId;
    const appSecret = this.config[platform]?.appSecret || this.config.appSecret;

    if (!appId || !appSecret) {
      this.setError('appId or appSecret not configured');
      return { errcode: -1, errmsg: 'appId or appSecret not configured' };
    }

    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const query = {
      appid: appId,
      secret: appSecret,
      js_code: code,
      grant_type: 'authorization_code',
    };

    const res = await this.httpGet(url, query);
    return res;
  }

  async getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false> {
    const sessionKey = param.sessionKey || param.session_key;
    const data = this.encryptedData(param.encryptedData!, param.iv!, sessionKey!);
    if (data === false) {
      return false;
    }
    return data.purePhoneNumber || data.phoneNumber;
  }

  getConfig(): OAuthConfig {
    return this.config;
  }

  setConfig(config: OAuthConfig): void {
    this.config = config;
  }
}

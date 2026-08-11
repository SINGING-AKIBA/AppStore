import { Provide } from '@midwayjs/decorator';
import { BaseDriver, Code2SessionResult, OAuthConfig } from './base.driver';

@Provide('tiktokDriver')
export class TiktokDriver extends BaseDriver {
  async code2session(param: string | { code: string }): Promise<Code2SessionResult> {
    const code = typeof param === 'string' ? param : param.code;

    if (!code) {
      this.setError('code cannot be empty');
      return { errcode: -1, errmsg: 'code cannot be empty' };
    }

    const appId = this.config.appId;
    const appSecret = this.config.appSecret;

    if (!appId || !appSecret) {
      this.setError('appId or appSecret not configured');
      return { errcode: -1, errmsg: 'appId or appSecret not configured' };
    }

    const url = 'https://developer.toutiao.com/api/apps/v2/jscode2session';
    const data = {
      code: code,
      appid: appId,
      secret: appSecret,
      anonymous_code: '',
    };

    const res = await this.httpPost(url, JSON.stringify(data));
    
    if (res.err_no !== 0) {
      this.setError(res.err_tips || 'tiktok oauth failed');
      return { errcode: res.err_no, errmsg: res.err_tips };
    }

    return res.data;
  }

  async getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false> {
    const sessionKey = param.sessionKey || param.session_key;
    const data = this.encryptedData(param.encryptedData!, param.iv!, sessionKey!);
    if (data === false) {
      return false;
    }
    return data.purePhoneNumber;
  }

  getConfig(): OAuthConfig {
    return this.config;
  }

  setConfig(config: OAuthConfig): void {
    this.config = config;
  }
}

import { Provide } from '@midwayjs/core';
import { BaseDriver, Code2SessionResult, OAuthConfig } from './base.driver';
import * as axios from 'axios';

@Provide('kuaishouDriver')
export class KuaishouDriver extends BaseDriver {
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

    const url = 'https://open.kuaishou.com/oauth2/mp/code2session';
    const data = new URLSearchParams({
      app_id: appId,
      app_secret: appSecret,
      js_code: code,
    });

    try {
      const response = await axios.default.post(url, data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const result = response.data;

      if (result.result !== 1) {
        this.setError(result.err_tips || 'get openid failed');
        return { errcode: result.result, errmsg: result.err_tips };
      }
      return {
        openid: result.openid,
        session_key: result.session_key,
        unionid: result.unionid,
      };
    } catch (error: any) {
      this.setError(error.message);
      return { errcode: -1, errmsg: error.message };
    }
  }

  async getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false> {
    const sessionKey = param.sessionKey || param.session_key;
    const data = this.encryptedData(param.encryptedData!, param.iv!, sessionKey!);
    if (data === false) {
      return false;
    }
    return data.phoneNumber;
  }

  getConfig(): OAuthConfig {
    return this.config;
  }

  setConfig(config: OAuthConfig): void {
    this.config = config;
  }
}

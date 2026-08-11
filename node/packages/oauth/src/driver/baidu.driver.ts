import { Provide } from '@midwayjs/core';
import { BaseDriver, Code2SessionResult, OAuthConfig } from './base.driver';

@Provide('baiduDriver')
export class BaiduDriver extends BaseDriver {
  private accessTokenCache: Map<string, { token: string; expiresAt: number }> = new Map();

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

    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return { errcode: -1, errmsg: this.getError() || 'get access token failed' };
    }

    const url = 'https://openapi.baidu.com/rest/2.0/smartapp/getsessionkey';
    const query = {
      access_token: accessToken,
      code: code,
    };

    const res = await this.httpGet(url, query);
    if (res.error) {
      this.setError(res.error_description || 'baidu oauth failed');
      return { errcode: res.error, errmsg: res.error_description };
    }
    return res.data;
  }

  async getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false> {
    const sessionKey = param.sessionKey || param.session_key;
    const data = this.encryptedData(param.encryptedData!, param.iv!, sessionKey!);
    if (data === false) {
      return false;
    }
    return data.mobile;
  }

  getConfig(): OAuthConfig {
    return this.config;
  }

  setConfig(config: OAuthConfig): void {
    this.config = config;
  }

  async getAccessToken(): Promise<string | false> {
    const appId = this.config.appId;
    if (!appId) {
      this.setError('appId not configured');
      return false;
    }

    const cacheKey = `baidu_access_token_${appId}`;
    const cached = this.accessTokenCache.get(cacheKey);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    const appSecret = this.config.appSecret;
    if (!appSecret) {
      this.setError('appSecret not configured');
      return false;
    }

    const url = 'https://openapi.baidu.com/oauth/2.0/token';
    const query = {
      grant_type: 'client_credentials',
      client_id: appId,
      client_secret: appSecret,
      scope: 'smartapp_snsapi_base',
    };

    const res = await this.httpGet(url, query);
    if (res.error) {
      this.setError(res.error_description || 'get access token failed');
      return false;
    }

    const expiresIn = res.expires_in || 2592000;
    this.accessTokenCache.set(cacheKey, {
      token: res.access_token,
      expiresAt: Date.now() + (expiresIn - 100) * 1000,
    });

    return res.access_token;
  }
}

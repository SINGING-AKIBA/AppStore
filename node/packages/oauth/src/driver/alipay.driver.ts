import { Provide } from '@midwayjs/core';
import * as crypto from 'crypto';
import { BaseDriver, Code2SessionResult, OAuthConfig } from './base.driver';

@Provide('alipayDriver')
export class AlipayDriver extends BaseDriver {
  async code2session(param: string | { code: string }): Promise<Code2SessionResult> {
    const code = typeof param === 'string' ? param : param.code;

    if (!code) {
      this.setError('code cannot be empty');
      return { errcode: -1, errmsg: 'code cannot be empty' };
    }

    const appId = this.config.appId;
    const privateKey = this.config.privateKey;

    if (!appId || !privateKey) {
      this.setError('appId or privateKey not configured');
      return { errcode: -1, errmsg: 'appId or privateKey not configured' };
    }

    const url = 'https://openapi.alipay.com/gateway.do';
    const bizContent = {
      grant_type: 'authorization_code',
      code: code,
    };

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const signData = {
      app_id: appId,
      method: 'alipay.system.oauth.token',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: timestamp,
      version: '1.0',
      biz_content: JSON.stringify(bizContent),
    };

    signData.sign = this.sign(signData, privateKey);

    const res = await this.httpPost(url, signData);
    const responseData = res.alipay_system_oauth_token_response;
    
    if (!responseData || responseData.code !== '10000') {
      this.setError(responseData?.sub_msg || 'alipay oauth failed');
      return { errcode: -1, errmsg: responseData?.sub_msg || 'alipay oauth failed' };
    }

    if (!this.verifyParams(responseData, this.config.publicKey)) {
      this.setError('data verification failed');
      return { errcode: -1, errmsg: 'data verification failed' };
    }

    return {
      openid: responseData.alipay_user_id,
      session_key: responseData.access_token,
    };
  }

  async getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false> {
    const data = this.encryptedDataAlipay(param.encryptedData!);
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

  private sign(data: Record<string, any>, privateKey: string): string {
    const content = this.getSignContent(data);
    const priKey = this.formatKey(privateKey, 'PRIVATE');
    const sign = crypto.sign('RSA-SHA256', Buffer.from(content), priKey);
    return sign.toString('base64');
  }

  public verify(content: string, sign: string, publicKey: string): boolean {
    const pubKey = this.formatKey(publicKey, 'PUBLIC');
    return crypto.verify('RSA-SHA256', Buffer.from(content), pubKey, Buffer.from(sign, 'base64'));
  }

  private verifyParams(params: any, publicKey: string): boolean {
    const sign = params.sign;
    const content = this.getSignContent(params);
    return this.verify(content, sign, publicKey);
  }

  private getSignContent(params: Record<string, any>): string {
    const sorted = Object.keys(params).sort();
    const parts: string[] = [];
    for (const key of sorted) {
      if (key === 'sign' || key === 'sign_type') continue;
      const value = params[key];
      if (typeof value === 'object') {
        parts.push(`${key}=${JSON.stringify(value)}`);
      } else {
        parts.push(`${key}=${value}`);
      }
    }
    return parts.join('&');
  }

  private formatKey(key: string, type: 'PUBLIC' | 'PRIVATE'): string {
    const prefix = type === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE';
    const formatted = key.replace(new RegExp(`-----BEGIN ${prefix} KEY-----`), '')
      .replace(new RegExp(`-----END ${prefix} KEY-----`), '')
      .replace(/\s/g, '');
    
    const lines: string[] = [];
    for (let i = 0; i < formatted.length; i += 64) {
      lines.push(formatted.substring(i, i + 64));
    }
    
    return `-----BEGIN ${prefix} KEY-----\n${lines.join('\n')}\n-----END ${prefix} KEY-----`;
  }

  private encryptedDataAlipay(encryptedData: string): any {
    try {
      const aesKey = Buffer.from(this.config.apiKey || '', 'base64');
      const aesCipher = Buffer.from(encryptedData, 'base64');
      const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, Buffer.alloc(16, 0));
      let decrypted = decipher.update(aesCipher, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      this.error = 'data parsing failed';
      return false;
    }
  }
}

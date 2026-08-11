import { Inject, Provide } from '@midwayjs/core';
import { HttpService } from '@midwayjs/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export enum OauthType {
  WECHAT = 'MP-WEIXIN',
  TIKTOK = 'MP-TOUTIAO',
  ALIPAY = 'MP-ALIPAY',
  BAIDU = 'MP-BAIDU',
  KUAISHOU = 'MP-KUAISHOU',
}

export interface OAuthConfig {
  appId?: string;
  appSecret?: string;
  publicKey?: string;
  privateKey?: string;
  notifyUrl?: string;
  returnUrl?: string;
  quitUrl?: string;
  mchId?: string;
  apiKey?: string;
  app?: {
    appId?: string;
    appSecret?: string;
  };
  jsapi?: {
    appId?: string;
    appSecret?: string;
  };
  h5?: {
    returnUrl?: string;
    appName?: string;
    appId?: string;
    appSecret?: string;
  };
}

export interface Code2SessionResult {
  openid?: string;
  session_key?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export interface PhoneNumberResult {
  phoneNumber?: string;
  purePhoneNumber?: string;
  countryCode?: string;
  watermark?: {
    timestamp: number;
    appid: string;
  };
}

@Provide()
export abstract class BaseDriver {
  @Inject()
  protected httpService: HttpService;

  protected error: string;
  protected config: OAuthConfig;

  abstract code2session(param: string | { code: string; platform?: string }): Promise<Code2SessionResult>;
  abstract getPhoneNumber(param: { encryptedData?: string; iv?: string; sessionKey?: string; session_key?: string }): Promise<string | false>;
  abstract getConfig(): OAuthConfig;
  abstract setConfig(config: OAuthConfig): void;

  protected setError(error: string): void {
    this.error = error;
  }

  public getError(): string {
    return this.error;
  }

  protected async httpGet(url: string, query?: Record<string, any>): Promise<any> {
    try {
      const response = await this.httpService.get(url, { params: query });
      return response.data;
    } catch (error: any) {
      this.error = error.message;
      return { errcode: -1, errmsg: error.message };
    }
  }

  protected async httpPost(url: string, data?: any): Promise<any> {
    try {
      const response = await this.httpService.post(url, data);
      return response.data;
    } catch (error: any) {
      this.error = error.message;
      return { errcode: -1, errmsg: error.message };
    }
  }

  protected async httpDownload(url: string, savePath: string): Promise<boolean> {
    try {
      const response = await this.httpService.get(url, { responseType: 'stream' });
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(true));
        writer.on('error', (err) => {
          this.error = err.message;
          reject(err);
        });
      });
    } catch (error: any) {
      this.error = error.message;
      return false;
    }
  }

  protected encryptedData(encryptedData: string, iv: string, sessionKey: string): any {
    if (sessionKey.length !== 24 || iv.length !== 24) {
      this.error = 'sessionKey or iv length error';
      return false;
    }

    try {
      const aesKey = Buffer.from(sessionKey, 'base64');
      const aesIV = Buffer.from(iv, 'base64');
      const aesCipher = Buffer.from(encryptedData, 'base64');

      const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, aesIV);
      let decrypted = decipher.update(aesCipher, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      const data = JSON.parse(decrypted);
      return data;
    } catch (error) {
      this.error = 'data parsing failed';
      return false;
    }
  }
}

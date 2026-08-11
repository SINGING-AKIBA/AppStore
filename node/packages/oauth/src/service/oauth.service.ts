import { Provide } from '@midwayjs/decorator';
import { Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OauthUser } from '../entity/oauth-user.entity';
import { BaseDriver, OauthType, Code2SessionResult } from '../driver/base.driver';
import { WechatDriver } from '../driver/wechat.driver';
import { TiktokDriver } from '../driver/tiktok.driver';
import { AlipayDriver } from '../driver/alipay.driver';
import { BaiduDriver } from '../driver/baidu.driver';
import { KuaishouDriver } from '../driver/kuaishou.driver';

export interface OAuthConfigOptions {
  wechat?: any;
  tiktok?: any;
  alipay?: any;
  baidu?: any;
  kuaishou?: any;
}

@Provide()
export class OAuthService {
  @Config('oauth')
  oauthConfig: OAuthConfigOptions;

  @InjectEntityModel(OauthUser)
  oauthUserModel: Repository<OauthUser>;

  private driverMap: Map<string, BaseDriver> = new Map();

  private getDriver(vendor: string): BaseDriver {
    if (this.driverMap.has(vendor)) {
      return this.driverMap.get(vendor);
    }

    let driver: BaseDriver;
    const config = this.getVendorConfig(vendor);

    switch (vendor) {
      case OauthType.WECHAT:
        driver = new WechatDriver();
        break;
      case OauthType.TIKTOK:
        driver = new TiktokDriver();
        break;
      case OauthType.ALIPAY:
        driver = new AlipayDriver();
        break;
      case OauthType.BAIDU:
        driver = new BaiduDriver();
        break;
      case OauthType.KUAISHOU:
        driver = new KuaishouDriver();
        break;
      default:
        throw new Error('Vendor not supported: ' + vendor);
    }

    driver.setConfig(config);
    this.driverMap.set(vendor, driver);
    return driver;
  }

  private getVendorConfig(vendor: string): any {
    const vendorKey = vendor.replace('MP-', '').toLowerCase();
    return this.oauthConfig[vendorKey] || {};
  }

  async code2session(vendor: string, param: string | { code: string; platform?: string }): Promise<Code2SessionResult> {
    const driver = this.getDriver(vendor);
    const result = await driver.code2session(param);

    if (result.openid) {
      await this.saveOrUpdateUser(vendor, result);
    }

    return result;
  }

  async getPhoneNumber(vendor: string, param: { encryptedData: string; iv: string; sessionKey: string }): Promise<string | false> {
    const driver = this.getDriver(vendor);
    return driver.getPhoneNumber(param);
  }

  getError(vendor: string): string {
    const driver = this.getDriver(vendor);
    return driver.getError();
  }

  private async saveOrUpdateUser(vendor: string, data: Code2SessionResult): Promise<OauthUser> {
    const existingUser = await this.oauthUserModel.findOne({
      where: { openid: data.openid, vendor: vendor },
    });

    if (existingUser) {
      existingUser.sessionKey = data.session_key;
      existingUser.unionid = data.unionid;
      existingUser.raw_data = JSON.stringify(data);
      return this.oauthUserModel.save(existingUser);
    } else {
      const newUser = new OauthUser();
      newUser.openid = data.openid || '';
      newUser.sessionKey = data.session_key || '';
      newUser.unionid = data.unionid || '';
      newUser.vendor = vendor;
      newUser.raw_data = JSON.stringify(data);
      return this.oauthUserModel.save(newUser);
    }
  }

  async findUserByOpenid(openid: string, vendor: string): Promise<OauthUser | null> {
    return this.oauthUserModel.findOne({ where: { openid, vendor } });
  }

  async updatePhoneNumber(id: number, phoneNumber: string): Promise<OauthUser> {
    const user = await this.oauthUserModel.findOne({ where: { id } });
    if (user) {
      user.phoneNumber = phoneNumber;
      return this.oauthUserModel.save(user);
    }
    throw new Error('User not found');
  }
}

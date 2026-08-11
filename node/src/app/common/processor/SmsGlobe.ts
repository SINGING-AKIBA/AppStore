import Dysmsapi20180501, * as $Dysmsapi20180501 from '@alicloud/dysmsapi20180501';

import { Processor, IProcessor } from '@midwayjs/bullmq';
import type { Context } from '@midwayjs/bullmq';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import { SmsRecords } from '@/app/admin/service/SmsRecords';
import { Inject, Config } from '@midwayjs/core';
@Processor('smsGlobe')
export class SmsProcessor implements IProcessor {
  @Inject()
  ctx: Context;

  @Config('dysmsGlobe')
  config;

  @Inject()
  smsRecords: SmsRecords;

  client(endpoint?:string) {
    const config = new $OpenApi.Config({
      accessKeyId: this.config.accessKeyId,
      accessKeySecret: this.config.accessKeySecret,
    });
    if (endpoint || this.config.endpoint) {
      config.endpoint = endpoint || this.config.endpoint;
    }
    return new Dysmsapi20180501(config);
  }
  /**
   * 国际短信
   * @param data 
   * @param data.mobile 手机号码 需要加区号 （86）
   * @param data?.message 短信内容
   * @param data?.type 短信类型
   * @param data?.templateCode 模板ID
   * @param data?.templateParam 模板参数
   * @param data?.user_id 用户ID
   * @returns 
   */
  async execute(data: any) {
    try {
      let resp;
      if (data.mobile.startsWith("86")) {
        const client = this.client();
        const req = new $Dysmsapi20180501.SendMessageWithTemplateRequest({
          to: data.mobile,
          from: data?.signName || this.config.signName,
          templateCode: data?.templateCode,
          templateParam: JSON.stringify(data?.templateParam || {}),
        });
        resp = await client.sendMessageWithTemplate(req);
      } else {
        const client = this.client();
        const req = new $Dysmsapi20180501.SendMessageToGlobeRequest({
          to: data.mobile,
          message: data.message,
          from: this.config.senderId,
        });
        resp = await client.sendMessageToGlobe(req);
      }

      await this.smsRecords.save({
        type: data?.type || 1,
        mobile: data.mobile,
        templateId: data?.templateCode || "globe",
        status: resp?.body?.code === 'OK' ? 20 : 30,
        success_switch: resp.body?.code === 'OK' ? 1 : 0,
        result_textarea: JSON.stringify(resp?.body),
        user_id: data?.user_id || 0,
        platform: '阿里云Globe',
        content: JSON.stringify(data?.templateParam || data?.message),
      });
      if (resp?.body?.code === 'OK') {
        return '短信发送成功';
      } else {
        throw new Error(resp?.body?.message || '短信发送失败');
      }
    } catch (error) {
      throw error;
    }
  }
}
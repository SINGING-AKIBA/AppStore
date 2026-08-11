import Dysmsapi20180501, * as $Dysmsapi20180501 from '@alicloud/dysmsapi20170525';
import { Processor, IProcessor} from '@midwayjs/bullmq';
import type { Context } from '@midwayjs/bullmq';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import { SmsRecords } from '@/app/admin/service/SmsRecords';
import { Inject, Config } from '@midwayjs/core';
@Processor('sms')
export class SmsProcessor implements IProcessor {
  @Inject()
  ctx: Context;

  @Config('dysms')
  config; 

  @Inject()
  smsRecords: SmsRecords;

  client() {
    const config = new $OpenApi.Config({
      accessKeyId: this.config.accessKeyId,
      accessKeySecret: this.config.accessKeySecret,
    });
    return new Dysmsapi20180501(config);
  }
  async execute(data: any) {
    const client = this.client();
    const req = new $Dysmsapi20180501.SendSmsRequest({
      phoneNumbers: data.mobile,
      signName: data?.signName || this.config.signName,
      templateCode: data?.templateCode,
      templateParam: JSON.stringify(data?.templateParam || {}),
    });
    try {
      const resp = await client.sendSms(req);
      await this.smsRecords.save({
        type: data?.type || 1,
        mobile: data.mobile,
        templateId: data?.templateCode,
        status: resp?.body?.code === 'OK' ? 20 : 30,
        success_switch: resp.body?.code === 'OK' ? 1 : 0,
        result_textarea: JSON.stringify(resp?.body),
        user_id: data?.user_id || 0,
        platform: '阿里云',
        content: JSON.stringify(data?.templateParam || {}),
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
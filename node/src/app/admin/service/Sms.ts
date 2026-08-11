import { Provide, Inject } from "@midwayjs/core";
import * as bullmq from "@midwayjs/bullmq";
import _ from "lodash";
@Provide()
export class Sms {
  @Inject()
  bullmq: bullmq.Framework;

  /*
   * 发送短信
   * @param {Object} data 发送短信参数
   * @param {String} data.mobile 手机号码
   * @param {String} data?.signName 签名
   * @param {String} data.templateCode 模板ID
   * @param {Object} data?.templateParam 模板参数
   * @param {String} data?.type AliyunOss短信类型
   * @param {String} data?.user_id 用户ID
   */
  async send(data) {
    const queue = this.bullmq.getQueue('sms');
    queue.addJobToQueue(data,{attempts:3,backoff:{type:'exponential',delay:1000}});
  }
}
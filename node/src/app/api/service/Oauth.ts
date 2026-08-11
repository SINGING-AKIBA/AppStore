import { Equal, In, Repository } from "typeorm";
import { Provide, Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { User as UserModel } from "@/app/common/model/User";
import config from '@/app/api/config';
import { RedisService } from '@midwayjs/redis';
import { Auth as AuthService } from '@/app/common/service/Auth'
import { password_verify, md5 } from '@/app/common/Utils';
import dayjs from "dayjs";
import _ from 'lodash';
import { Sms as SmsService} from "@/app/admin/service/Sms";
import { Settings } from "@/app/common/service/Settings";
import { randomUUID } from 'node:crypto';

@Provide()
export class Oauth extends AuthService {
  @InjectEntityModel(UserModel)
  model!: Repository<UserModel>;

  @Inject()
  settings: Settings;

  protected selectFields = ["id", "name"];
  protected join: selectJoin[] = [
  ];

  @Inject()
  ctx!: any;

  @Inject()
  redisService!: RedisService;

  @Inject()
  sms!: SmsService;
  getConfig() {
    const options: any = config.jwt;
    const secret = options?.secret;
    const expiresIn = options.sign?.expiresIn;
    return { secret, expiresIn };
  }
  protected filterWhere() {
    return {
    };
  }

  async login(params: any) {
    if (!this.validateMobile(params.phone)) {
      throw new Error('手机号码格式错误');
    }
    if(_.isEmpty(params.code)){
      throw new Error('请输入验证码');
    }
    const loginCacheKey = 'login:' + params.phone;
    const loginCacheKeyday = 'login:day:' + params.phone;
    const code = await this.redisService.get(loginCacheKey);
    if (!code) {
      throw new Error('验证码已过期');
    }else if (_.toNumber(code) !== _.toNumber(params.code)) {
      throw new Error('验证码错误');
    }
    this.redisService.del(loginCacheKeyday);
    this.redisService.del(loginCacheKey);
    let user = await this.model.findOne({
      where: {
        mobile: Equal(params.phone),
      },
    });
    if (!user) {
      user = await this.register(params.phone,{schools_id: params.schools_id || 0, teams_id: params.teams_id || 0})
    }else{
      this.model.update(user.id, {
        'last_login_ip': this.ctx.ip,
        'last_login_time': dayjs().unix(),
      });
    }
    if(user.status !== 10){
      throw new Error(user.message || '您已被禁止使用');
    }
    // 注意：User模型中没有password字段，如果需要密码验证，需要在User模型中添加password字段
    // else if (!password_verify(params.password, user.password)) {
    //   throw new Error('密码错误');
    // }
    const data = {
      login_time: Date.now(),
      ip: this.ctx.ip,
      nonce_str: randomUUID() ,
      from: 'api',
    }
    const token = this.getUserToken(data);
    const cacheKey = md5(token.token);
    await this.redisService.set(cacheKey, JSON.stringify(user), 'EX', token.expiresIn);
    return { token: token.token, userInfo: user };
  }
  async register(mobile: string, partyData: any ={}) {
    //注册来源:H5=web,APP=app,MP-WEIXIN=微信小程序,MP-ALIPAY=支付宝小程序,MP-TOUTIAO=抖音小程序,MP-QQ=QQ小程序,MP-KUAISHOU=快手小程序
    const data = {
      'mobile'     : mobile,
      'nick_name'  : partyData['nickname'] || (`用户${dayjs().format('DDHHmmss')}`),
      'avatar_img' : await this.download(partyData['avatar'] || 0),
      'gender'     : partyData['gender'] || "0",
      'country'    : partyData['country'] || '',
      'province'   : partyData['province'] || '',
      'city'       : partyData['city'] || '',
      'platform'   : 'MP-WEIXIN' as const,
      'grade_id'   : 1,
      'status'     : 10,
      'message'    : '',
      'last_login_ip': this.ctx.ip,
      'last_login_time': dayjs().unix(),
      'schools_id' : partyData['schools_id'] || 0,
      'teams_id'   : partyData['teams_id'] || 0,
    };
    return await this.model.save(data);
  }

  validateMobile(mobile: string) {
      const reg = /^1[3-9]\d{9}$/;
      return reg.test(mobile);
  }

  async download(url: string) {
    return 0;
  }

  async captcha(params: any) {
    if(!this.validateMobile(params.phone)){
      throw new Error('手机号码格式错误');
    };
    const loginCacheKeyminute = 'login:minute:' + params.phone;
    const loginCacheKeyday = 'login:day:' + params.phone;
    const minute = await this.redisService.get(loginCacheKeyminute);
    const day = await this.redisService.get(loginCacheKeyday);
    if(minute) {
      throw new Error('登录频繁,请骚后再试');
    }
    if(day && _.toNumber(day) > 10) {
      throw new Error('24小时内获取次数过多,请24小时后再重试');
    }
    const sms_config = await this.settings.getItem('sms_setting');
    const loginCacheKey = 'login:' + params.phone;
    let code = _.random(100000,999999);
    if(sms_config.debug == '1' && sms_config.debug_code){
      code = sms_config.debug_code;
    }
    if(sms_config.debug == '1'){
      this.redisService.set(loginCacheKey, code, 'EX', 60 * 10);
      return '验证码已发送,请查收'+code;
    }
    await this.sms.send({
      mobile: params.phone,
      templateParam: {code: code},
      templateCode: sms_config.template_id,
    });

    this.redisService.set(loginCacheKey, code, 'EX', 60 * 10);
    this.redisService.set(loginCacheKeyday, _.toNumber(day) + 1, 'EX', 60 * 60 * 24);
    this.redisService.set(loginCacheKeyminute, 1, 'EX', 60);
    return '验证码已发送,请查收';
  }

  async logout() {
    const parts = this.ctx.get('authorization').trim().split(' ');
    const token = parts[1] || parts[0];
    if (token) {
      const cacheKey = md5(token);
      await this.redisService.del(cacheKey);
    }
    return '登出成功';
  }

    
  async agreement(){
    return await this.settings.getItem('agreement_setting');
  }
}

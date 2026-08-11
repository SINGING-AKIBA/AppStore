import { Provide, Config } from '@midwayjs/core';
import { makeHttpRequest } from '@midwayjs/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ---------- 类型定义 ----------

/** 企业微信 access_token 结果 */
export interface WecomAccessTokenResult {
  accessToken: string;
  expiresIn: number;
}

/** 通过 code 换取的用户身份 */
export interface WecomCode2UserResult {
  errcode: number;
  errmsg: string;
  /** 成员 UserID。若企业已绑定微信开发者平台，可返回第三方唯一标识 */
  userId?: string;
  /** 成员票据，用于获取成员详情，有效期 20 分钟 */
  userTicket?: string;
  /** 非企业成员时返回的 OpenId */
  openId?: string;
  /** 外部联系人 id，当用户是企业的客户且企业开启了客户联系功能时返回 */
  externalUserId?: string;
}

/** 企业微信成员详情 */
export interface WecomUserDetail {
  userId: string;
  name: string;
  alias?: string;
  mobile?: string;
  department: number[];
  position?: string;
  email?: string;
  /** 头像 url。注：如果要获取小图，仅需将 url 最后的 _0 替换成 _100 */
  avatar?: string;
  thumbAvatar?: string;
  /** 激活状态：1=已激活，2=已禁用，4=未激活，5=退出 */
  status: number;
  mainDepartment?: number;
  /** 扩展属性 */
  externalProfile?: Record<string, any>;
  /** 地址 */
  address?: string;
  /** 全局唯一的外部联系人 id */
  externalUserId?: string;
  /** 企业对外简称 */
  aliasDep?: string[];
}

/** JS-SDK 签名配置 */
export interface WecomJsApiConfig {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

/** 侧边栏身份信息（登录态） */
export interface WecomAuthSession {
  userId: string;
  userTicket: string;
  expiresAt: number;
}

/** 上传临时素材结果 */
export interface WecomUploadMediaResult {
  errcode: number;
  errmsg: string;
  type: string;
  media_id: string;
  created_at: number;
}

/** 企业微信媒体文件类型 */
export type WecomMediaType = 'image' | 'voice' | 'video' | 'file';

// ---------- 常量 ----------

const MEDIA_MIME_MAP: Record<WecomMediaType, string> = {
  image: 'image/jpeg',
  voice: 'audio/amr',
  video: 'video/mp4',
  file: 'application/octet-stream',
};

const MEDIA_EXT_MAP: Record<WecomMediaType, string> = {
  image: 'jpg',
  voice: 'amr',
  video: 'mp4',
  file: 'bin',
};

// ---------- 服务 ----------

@Provide()
export class BaseService {

  @Config('wecom')
  wecomConfig: {
    agentId: string;
    secret: string;
    corpId: string;
  };



  // ==================== Access Token ====================

  /**
   * 获取企业微信 access_token（自动缓存，过期前 5 分钟刷新）
   */
  async getAccessToken(): Promise<any> {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.wecomConfig.corpId}&corpsecret=${this.wecomConfig.secret}`;
    const res = await makeHttpRequest(url, {
      dataType: 'json',
      contentType:'json'
    });

    const data = res.data as { errcode: number; errmsg: string; access_token?: string; expires_in?: number };
    if (data.errcode !== 0) {
      throw new Error(`获取 access_token 失败 [${data.errcode}]: ${data.errmsg}`);
    }
    return data;
  }


  // ==================== OAuth 授权 ====================

  /**
   * 构造企业微信 OAuth 授权链接（侧边栏跳转用）
   *
   * @param redirectUri - 授权后回调地址（需 urlencode）
   * @param state - 防跨站攻击参数，建议携带来源路径
   * @param scope - 授权范围，snsapi_base（静默） | snsapi_privateinfo（弹出）
   */
  getOAuthUrl(redirectUri: string, state = 'wecom_sidebar', scope: 'snsapi_base' | 'snsapi_privateinfo' = 'snsapi_base'): string {
    const encodedRedirect = encodeURIComponent(redirectUri);
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.wecomConfig.corpId}&redirect_uri=${encodedRedirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }

  /**
   * 通过 OAuth code 换取用户身份
   *
   * 侧边栏授权流程：
   *   前端跳转 OAuth → 回调带上 code → 服务端用此方法换取 userId
   */
  async code2UserInfo(code: string,accessToken:string): Promise<WecomCode2UserResult> {
    const url = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo';
    const res = await makeHttpRequest(url, {
      data: {
        access_token: accessToken,
        code,
      },
      dataType: 'json',
      contentType:'json'
    });

    const data = res.data as {
      errcode: number;
      errmsg: string;
      UserId?: string;
      user_ticket?: string;
      OpenId?: string;
      ExternalUserId?: string;
    };

    if (data.errcode !== 0) {
      throw new Error(`获取用户身份失败 [${data.errcode}]: ${data.errmsg}`);
    }

    return {
      errcode: data.errcode,
      errmsg: data.errmsg,
      userId: data.UserId,
      userTicket: data.user_ticket,
      openId: data.OpenId,
      externalUserId: data.ExternalUserId,
    };
  }

  /**
   * 获取成员详情
   *
   * @param userId - 成员 UserId（从 code2UserInfo 获得）
   */
  async getUserDetail(userId: string): Promise<WecomUserDetail> {
    const accessToken = await this.getAccessToken();
    const url = 'https://qyapi.weixin.qq.com/cgi-bin/user/get';
    const res = await makeHttpRequest(url, {
      data: {
        access_token: accessToken,
        userid: userId,
      },
      dataType: 'json',
      contentType:'json'
    });

    const data = res.data as {
      errcode: number;
      errmsg: string;
      userid: string;
      name: string;
      alias?: string;
      mobile?: string;
      department: number[];
      position?: string;
      email?: string;
      avatar?: string;
      thumb_avatar?: string;
      status: number;
      main_department?: number;
      external_profile?: Record<string, any>;
      address?: string;
      external_userid?: string;
      alias_dep?: string[];
    };

    if (data.errcode !== 0) {
      throw new Error(`获取用户详情失败 [${data.errcode}]: ${data.errmsg}`);
    }

    return {
      userId: data.userid,
      name: data.name,
      alias: data.alias,
      mobile: data.mobile,
      department: data.department,
      position: data.position,
      email: data.email,
      avatar: data.avatar,
      thumbAvatar: data.thumb_avatar,
      status: data.status,
      mainDepartment: data.main_department,
      externalProfile: data.external_profile,
      address: data.address,
      externalUserId: data.external_userid,
      aliasDep: data.alias_dep,
    };
  }

  /**
   * 使用 user_ticket 获取成员详情（更安全的身份确认方式）
   *
   * 适用场景：OAuth scope 为 snsapi_privateinfo 时返回的 user_ticket
   */
  async getUserDetailByTicket(userTicket: string,accessToken:string): Promise<WecomUserDetail> {
    const url = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail';
    const res = await makeHttpRequest(url, {
      data: {
        access_token: accessToken,
        user_ticket: userTicket,
      },
      dataType: 'json',
      contentType:'json'
    });

    const data = res.data as {
      errcode: number;
      errmsg: string;
      userid: string;
      name: string;
      mobile?: string;
      department: number[];
      position?: string;
      email?: string;
      avatar?: string;
      thumb_avatar?: string;
      status: number;
      main_department?: number;
      address?: string;
      external_userid?: string;
    };

    if (data.errcode !== 0) {
      throw new Error(`通过 ticket 获取用户详情失败 [${data.errcode}]: ${data.errmsg}`);
    }

    return {
      userId: data.userid,
      name: data.name,
      mobile: data.mobile,
      department: data.department,
      position: data.position,
      email: data.email,
      avatar: data.avatar,
      thumbAvatar: data.thumb_avatar,
      status: data.status,
      mainDepartment: data.main_department,
      address: data.address,
      externalUserId: data.external_userid,
    };
  }

  // ==================== JS-SDK ====================

  /**
   * 获取 jsapi_ticket（用于 JS-SDK 签名）
   */
  async getJsApiTicket(accessToken:string,type:'app' | 'corp'='app'): Promise<string> {
    let url = '';
    if(type==='corp'){
      url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${accessToken}`;
    }else{
      url = `https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token=${accessToken}&type=agent_config`;
    }
    const res = await makeHttpRequest(url, {
      dataType: 'json',
      contentType:'json'
    });

    const data = res.data as { errcode: number; errmsg: string; ticket?: string; expires_in?: number };
    if (data.errcode !== 0) {
      throw new Error(`获取 jsapi_ticket 失败 [${data.errcode}]: ${data.errmsg}`);
    }

    return data.ticket!;
  }

  /**
   * 生成 JS-SDK 签名配置（供前端 wx.config 使用）
   *
   * @param url - 当前页面的完整 URL（包括 ? 和 # 部分）
   */
  async getJsApiConfig(url: string,ticket:string): Promise<WecomJsApiConfig> {
    const nonceStr = this.generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);

    // 按字典序排序参数并拼接
    const signatureStr = [
      `jsapi_ticket=${ticket}`,
      `noncestr=${nonceStr}`,
      `timestamp=${timestamp}`,
      `url=${url}`,
    ].join('&');

    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    return {
      appId: this.wecomConfig.corpId,
      timestamp,
      nonceStr,
      signature,
    };
  }

  // ==================== 工具方法 ====================

  /**
   * 生成随机字符串
   */
  private generateNonceStr(length = 16): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }

  // ==================== 素材上传 ====================

  /**
   * 上传临时素材到企业微信（支持本地文件路径和网络文件 URL）
   *
   * 接口文档：https://developer.work.weixin.qq.com/document/path/90253
   *
   * 网络文件处理流程：
   *   1. 服务端下载网络文件到内存
   *   2. 以 multipart/form-data 格式上传到企业微信
   *
   * @param type         媒体文件类型：image | voice | video | file
   * @param filePathOrUrl 本地文件路径 或 网络文件 URL（http/https）
   * @param accessToken   可选，不传则自动获取
   */
  async uploadMedia(
    type: WecomMediaType,
    filePathOrUrl: string,
    accessToken?: string,
  ): Promise<WecomUploadMediaResult> {
    const token = accessToken || (await this.getAccessToken());

    // ----- Step 1: 获取文件 Buffer（本地读取 / 网络下载） -----
    let fileBuffer: Buffer;
    let fileName: string;

    if (/^https?:\/\//i.test(filePathOrUrl)) {
      // 网络文件：下载到内存
      const resp = await fetch(filePathOrUrl);
      if (!resp.ok) {
        throw new Error(`下载网络文件失败 [${resp.status}]: ${resp.statusText}`);
      }
      fileBuffer = Buffer.from(await resp.arrayBuffer());

      // 从 URL 中提取文件名
      try {
        const urlObj = new URL(filePathOrUrl);
        fileName = path.basename(urlObj.pathname) || 'file';
      } catch {
        fileName = 'file';
      }

      // 没有扩展名时根据媒体类型补上后缀
      if (!path.extname(fileName)) {
        fileName += `.${MEDIA_EXT_MAP[type]}`;
      }
    } else {
      // 本地文件：直接读取
      fileBuffer = await fs.promises.readFile(filePathOrUrl);
      fileName = path.basename(filePathOrUrl);
    }

    // ----- Step 2: 以 multipart/form-data 上传到企业微信 -----
    const uploadUrl = `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${token}&type=${type}`;

    const form = new FormData();
    form.append('media', new Blob([new Uint8Array(fileBuffer)], { type: MEDIA_MIME_MAP[type] }), fileName);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: form,
    });

    const data = (await response.json()) as WecomUploadMediaResult;

    if (data.errcode !== 0) {
      throw new Error(`上传素材失败 [${data.errcode}]: ${data.errmsg}`);
    }

    return data;
  }
}

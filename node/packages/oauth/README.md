# midway-oauth

基于 MidwayJS 4.x + TypeORM 0.3.x 的 OAuth 自定义组件，支持微信、抖音、支付宝、百度、快手等平台的登录授权。

## 安装

```bash
npm install midway-oauth
```

## 依赖

需要在主项目中安装以下依赖：

```bash
npm install @midwayjs/core@4 @midwayjs/typeorm@4 typeorm
```

## 快速开始

### 1. 配置组件

在主应用的 `src/config/config.default.ts` 中配置：

```typescript
import { MidwayConfig } from '@midwayjs/core';

export default {
  // ... 其他配置
  oauth: {
    wechat: {
      app: {
        appId: 'your_app_id',
        appSecret: 'your_app_secret',
      },
      jsapi: {
        appId: 'your_mini_app_id',
        appSecret: 'your_mini_app_secret',
      },
    },
    tiktok: {
      appId: 'your_tiktok_app_id',
      appSecret: 'your_tiktok_app_secret',
    },
    alipay: {
      appId: 'your_alipay_app_id',
      privateKey: 'your_private_key',
      publicKey: 'alipay_public_key',
    },
    baidu: {
      appId: 'your_baidu_app_id',
      appSecret: 'your_baidu_app_secret',
    },
    kuaishou: {
      appId: 'your_kuaishou_app_id',
      appSecret: 'your_kuaishou_app_secret',
    },
  },
} as MidwayConfig;
```

### 2. 在主应用启用组件

```typescript
// src/configuration.ts
import { Configuration } from '@midwayjs/core';
import { TypeORMFramework } from '@midwayjs/typeorm';
import { Configuration as OAuthConfiguration } from 'midway-oauth';

@Configuration({
  imports: [
    TypeORMFramework,
    OAuthConfiguration,
  ],
})
export class MainConfiguration {}
```

### 3. 使用服务

```typescript
import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { OAuthService, OauthType } from 'midway-oauth';

export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  oauthService: OAuthService;

  // 微信登录
  async wechatLogin() {
    const { code } = this.ctx.request.body;
    
    // code2session 获取 openid 和 session_key
    const result = await this.oauthService.code2session(OauthType.WECHAT, {
      code,
      platform: 'jsapi', // 可选: app, jsapi, h5
    });

    if (result.errcode) {
      return { success: false, message: result.errmsg };
    }

    // result.openid     // 用户唯一标识
    // result.session_key // 会话密钥
    // result.unionid    // 开放平台唯一标识

    return { success: true, data: result };
  }

  // 获取用户手机号
  async getPhoneNumber() {
    const { encryptedData, iv, sessionKey } = this.ctx.request.body;
    
    const phoneNumber = await this.oauthService.getPhoneNumber(OauthType.WECHAT, {
      encryptedData,
      iv,
      sessionKey,
    });

    return { success: true, phoneNumber };
  }

  // 抖音登录
  async tiktokLogin() {
    const { code } = this.ctx.request.body;
    const result = await this.oauthService.code2session(OauthType.TIKTOK, code);
    return result;
  }

  // 支付宝登录
  async alipayLogin() {
    const { code } = this.ctx.request.body;
    const result = await this.oauthService.code2session(OauthType.ALIPAY, code);
    return result;
  }

  // 百度登录
  async baiduLogin() {
    const { code } = this.ctx.request.body;
    const result = await this.oauthService.code2session(OauthType.BAIDU, code);
    return result;
  }

  // 快手登录
  async kuaishouLogin() {
    const { code } = this.ctx.request.body;
    const result = await this.oauthService.code2session(OauthType.KUAISHOU, code);
    return result;
  }
}
```

## API

### OAuthService

#### code2session(vendor: string, param: string | { code: string; platform?: string }): Promise<Code2SessionResult>

通过授权码获取用户信息。

**参数：**
- `vendor`: 厂商类型，使用 `OauthType` 枚举
- `param`: 授权码或包含授权码和平台的对象

**返回：**
```typescript
interface Code2SessionResult {
  openid?: string;
  session_key?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}
```

#### getPhoneNumber(vendor: string, param: { encryptedData: string; iv: string; sessionKey: string }): Promise<string | false>

获取用户手机号。

#### findUserByOpenid(openid: string, vendor: string): Promise<OauthUser | null>

根据 openid 查询用户。

#### updatePhoneNumber(id: number, phoneNumber: string): Promise<OauthUser>

更新用户手机号。

### OauthType 枚举

```typescript
enum OauthType {
  WECHAT = 'MP-WEIXIN',    // 微信
  TIKTOK = 'MP-TOUTIAO',   // 抖音
  ALIPAY = 'MP-ALIPAY',    // 支付宝
  BAIDU = 'MP-BAIDU',      // 百度
  KUAISHOU = 'MP-KUAISHOU', // 快手
}
```

## 数据表

组件会自动创建 `oauth_user` 表，字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| openid | varchar(128) | 用户唯一标识 |
| unionid | varchar(128) | 开放平台唯一标识 |
| vendor | varchar(32) | 厂商类型 |
| session_key | varchar(256) | 会话密钥 |
| phone_number | varchar(32) | 手机号 |
| raw_data | text | 原始数据 JSON |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 错误处理

```typescript
async login() {
  try {
    const result = await this.oauthService.code2session(OauthType.WECHAT, code);
    
    if (result.errcode) {
      // 获取错误信息
      const errorMsg = this.oauthService.getError(OauthType.WECHAT);
      console.log('Error:', errorMsg);
      return { success: false, error: errorMsg };
    }
    
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 平台说明

### 微信小程序 (jsapi)

```typescript
const result = await this.oauthService.code2session(OauthType.WECHAT, {
  code: 'authorization_code',
  platform: 'jsapi',
});
```

### 微信 APP

```typescript
const result = await this.oauthService.code2session(OauthType.WECHAT, {
  code: 'authorization_code',
  platform: 'app',
});
```

### 微信 H5

```typescript
const result = await this.oauthService.code2session(OauthType.WECHAT, {
  code: 'authorization_code',
  platform: 'h5',
});
```

##  License

MIT

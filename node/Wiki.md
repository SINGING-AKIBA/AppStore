# Smile Admin 项目 Wiki

## 项目概述

Smile Admin 是一个基于 **Midway.js v4** 的 Node.js 后台管理系统，采用 **TypeScript** 开发，集成了 **TypeORM** 作为 ORM 框架，提供 RESTful API 服务。

### 核心特性

- 基于 Midway.js 框架，支持依赖注入
- TypeScript 全栈开发，类型安全
- TypeORM 数据库操作，支持多对多关联
- JWT 身份认证 + Casbin 权限控制
- Redis 缓存支持
- Swagger API 文档自动生成
- 多模块架构（admin/api）
- 文件上传支持（本地/阿里云OSS/腾讯云COS/七牛云）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Midway.js v4 |
| 语言 | TypeScript 4.4+ |
| ORM | TypeORM 0.3.28 |
| 数据库 | MySQL 8.0+ |
| 缓存 | Redis |
| 认证 | JWT + Casbin |
| 校验 | Joi |
| 文档 | Swagger |
| 测试 | Jest |

---

## 项目结构

```
src/
├── app/
│   ├── admin/              # 后台管理模块
│   │   ├── controller/     # 控制器层
│   │   ├── service/        # 业务逻辑层
│   │   └── validate/       # 参数校验
│   ├── api/                # 公开 API 模块
│   │   ├── controller/
│   │   ├── service/
│   │   └── validate/
│   └── common/             # 公共模块
│       ├── controller/     # 基础控制器
│       ├── model/          # TypeORM 实体
│       ├── service/        # 基础服务
│       ├── validate/       # 基础校验
│       └── enum/           # 枚举定义
├── config/                 # 配置文件
│   ├── config.default.ts   # 默认配置
│   ├── config.local.ts     # 本地环境
│   ├── config.dev.ts       # 开发环境
│   └── config.prod.ts      # 生产环境
├── decorator/              # 自定义装饰器
├── filter/                 # 异常过滤器
├── middleware/             # 中间件
├── migrations/             # 数据库迁移
├── configuration.ts        # 应用配置入口
└── interface.ts            # 类型定义
```

---

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- MySQL 8.0+
- Redis 6.0+

### 安装依赖

```bash
pnpm install
```

### 配置环境

复制并修改配置文件：

```bash
cp src/config/config.local.ts src/config/config.local.ts
```

修改数据库和 Redis 连接配置。

### 启动开发服务器

```bash
npm run dev
```

服务默认运行在 http://localhost:7002

### 生产部署

```bash
npm run build
npm start
```

---

## 核心架构

### 1. 控制器层 (Controller)

控制器负责处理 HTTP 请求，调用服务层，返回响应。

```typescript
@SmileController("", { tagName: "admin/会员列表" })
export class User extends Base {
  @Inject()
  service: UserService;

  @Get("/index")
    async index(@Query() query: UserIndex) {
    this.success(await this.service.index(query));
  }
}
```

**SmileController 装饰器**

自动根据文件路径生成路由前缀：
- 文件路径: `src/app/admin/controller/User.ts`
- 生成前缀: `/admin/user`

### 2. 服务层 (Service)

服务层继承 `Base` 类，提供通用的 CRUD 操作：

```typescript
@Provide()
export class User extends Base {
  @InjectEntityModel(UserModel)
  protected model: Repository<UserModel>;
  
  protected selectFields = ['id', 'nick_name'];
  
  protected filterWhere() {
    return {
      equal: ['id', 'status'],
      like: ['nick_name', 'mobile'],
      between: ['created_at'],
    };
  }
}
```

**Base 服务提供的方法：**

| 方法 | 说明 |
|------|------|
| `index()` | 分页列表查询 |
| `detail()` | 单条详情查询 |
| `save()` | 新增数据 |
| `update()` | 更新数据 |
| `delete()` | 删除数据 |
| `select()` | 下拉选择数据 |
| `increment()` | 字段自增 |
| `decrement()` | 字段自减 |
| `transaction()` | 事务处理 |

### 3. 模型层 (Model)

使用 TypeORM 装饰器定义实体：

```typescript
@Entity("smile_user", { comment: "会员列表" })
export class User extends Base {
  @Column("varchar", { name: "nick_name", comment: "用户昵称", length: 765 })
  nick_name: string;

  @ManyToMany(() => Actors, (actors) => actors.short_plays)
  @JoinTable({
    name: "smile_short_plays_actors",
    joinColumns: [{ name: "short_plays_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "actors_id", referencedColumnName: "id" }],
  })
  actors: Actors[];
}
```

### 4. 验证层 (Validate)

使用 Joi 进行参数校验：

```typescript
export class UserUpdate extends PickDto(User, [
  "nick_name", "gender", "mobile", "status"
]) {}

export class UserIndex extends PickDto(User, ["page", "pageSize"]) {}
```

---

## 查询条件支持

Base 服务支持多种查询操作符：

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `equal` | 等于/IN 查询 | `id=1` 或 `id[]=1&id[]=2` |
| `like` | 模糊查询 | `nick_name=张` |
| `between` | 范围查询 | `created_at[]=2024-01-01&created_at[]=2024-12-31` |
| `not` | 不等于/NOT IN | |
| `moreThan` | 大于 | |
| `lessThan` | 小于 | |
| `moreThanOrEqual` | 大于等于 | |
| `lessThanOrEqual` | 小于等于 | |

---

## 中间件

### Admin 中间件

后台权限认证中间件，功能包括：
- JWT Token 验证
- Casbin 权限检查
- 白名单放行

```typescript
// 公开接口（无需登录）
protected publicAction = ['login', 'logout'];

// 免权限检查接口
protected allows = ['admin/info', 'menu/index'];
```

### Api 中间件

公开 API 中间件（目前仅透传）。

---

## 数据库实体

### 用户相关

| 实体 | 表名 | 说明 |
|------|------|------|
| User | smile_user | 会员列表 |
| Admin | smile_admin | 管理员列表 |

### 短剧相关

| 实体 | 表名 | 说明 |
|------|------|------|
| ShortPlays | smile_short_plays | 短剧管理 |
| Actors | smile_actors | 演员管理 |
| Category | smile_category | 分类管理 |

### 系统相关

| 实体 | 表名 | 说明 |
|------|------|------|
| Menu | smile_menu | 菜单管理 |
| Settings | smile_settings | 系统设置 |
| Uploads | smile_uploads | 文件上传记录 |
| SmileRules | smile_rules | Casbin 权限规则 |

---

## API 接口

### 后台管理接口 (前缀: /admin)

| 控制器 | 接口 | 说明 |
|--------|------|------|
| Auth | POST /admin/auth/login | 管理员登录 |
| Auth | POST /admin/auth/logout | 管理员登出 |
| User | GET /admin/user/index | 会员列表 |
| User | POST /admin/user/save | 新增会员 |
| User | POST /admin/user/update | 更新会员 |
| User | POST /admin/user/delete | 删除会员 |
| Actors | GET /admin/actors/index | 演员列表 |
| Category | GET /admin/category/index | 分类列表 |
| Menu | GET /admin/menu/index | 菜单列表 |
| Settings | GET /admin/settings/index | 系统设置 |

### 公开 API 接口 (前缀: /api)

| 控制器 | 接口 | 说明 |
|--------|------|------|
| Home | GET /api/home/index | 首页数据 |
| User | POST /api/user/login | 用户登录 |

---

## CRUD 代码生成器

项目内置 `packages/crud` 代码生成器，用于从数据库表生成 TypeORM 实体。

### 使用方法

```bash
cd packages/crud
npm run build
npm start
```

### 支持的数据库

- MySQL / MariaDB
- PostgreSQL
- Microsoft SQL Server
- Oracle
- SQLite

---

## 配置文件详解

### config.default.ts

```typescript
export default {
  keys: 'your-secret-key',
  koa: {
    port: 7002,           // 服务端口
  },
  cors: {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  },
  swagger: {
    title: 'smile admin',
    version: '1.0.0',
    auth: {
      name: 'authorization',
      authType: 'apikey',
      in: 'header',
    },
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1",
      db: 9,
    },
  },
} as MidwayConfig;
```

---

## 常用命令

```bash
# 开发调试
npm run dev

# 构建项目
npm run build

# 生产启动
npm start

# 运行测试
npm test

# 测试覆盖率
npm run cov

# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 代码格式化
npm run prettier
```

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件 | PascalCase | `User.ts`, `UserService.ts` |
| 类 | PascalCase | `class User extends Base` |
| 方法 | camelCase | `getUserId()`, `index()` |
| 变量 | camelCase | `userList`, `pageSize` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 数据库字段 | snake_case | `nick_name`, `last_login_time` |

### 代码风格

- 缩进: 2 个空格
- 换行符: LF (Unix)
- 编码: UTF-8

### 导入顺序

```typescript
// 1. 外部库
import { Get, Post, Inject } from '@midwayjs/core';

// 2. 内部别名
import { User } from '@/app/common/model/User';

// 3. 相对路径
import { Base } from './Base';
```

---

## 常见问题

### 1. 数据库连接失败

检查 `config.local.ts` 中的数据库配置，确保 MySQL 服务已启动。

### 2. Redis 连接失败

检查 Redis 服务是否启动，配置是否正确。

### 3. 权限验证失败

检查请求头是否包含有效的 `authorization` Token。

### 4. 多对多关联保存失败

Base 服务已自动处理多对多关联，传入 ID 数组即可：

```typescript
// 传入演员 ID 数组
{
  title: "短剧标题",
  actors: [1, 2, 3]  // 自动转换为关联对象
}
```

---

## 相关链接

- [Midway.js 官方文档](https://midwayjs.org/)
- [TypeORM 官方文档](https://typeorm.io/)
- [Casbin 权限文档](https://casbin.org/)

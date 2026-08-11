# Request Service 使用文档

基于 uni-app 的 HTTP 请求封装服务，提供请求/响应拦截、文件上传/下载等功能。

## 导入方式

```typescript
import request from "@/smile/service/request"
```

## 基础用法

### GET 请求

```typescript
// 简单 GET
const res = await request.get('/api/users')

// 带查询参数
const res = await request.get('/api/users', { page: 1, size: 10 })

// 带泛型指定返回类型
interface User { id: number; name: string }
const res = await request.get<User>('/api/users/1')
console.log(res.data) // User 类型
```

### POST 请求

```typescript
// 简单 POST
const res = await request.post('/api/users', { name: 'test', age: 18 })

// 带泛型
interface CreateUserResult { id: number }
const res = await request.post<CreateUserResult>('/api/users', { name: 'test' })
```

### PUT 请求

```typescript
const res = await request.put('/api/users/1', { name: 'updated' })
```

### DELETE 请求

```typescript
const res = await request.delete('/api/users/1')
```

### 通用 request 方法

```typescript
const res = await request.request<User>({
  url: '/api/users',
  method: 'GET',
  params: { id: 1 },
  headers: { 'Custom-Header': 'value' },
  timeout: 10000
})
```

## 请求拦截器

### 添加自定义请求拦截器

```typescript
request.useRequestInterceptor((config) => {
  // 修改请求配置
  config.headers = config.headers || {}
  config.headers['X-Custom-Header'] = 'custom-value'
  return config
})
```

> 注意：已内置 `tokenInterceptor`，自动从 store 获取 user.token 并添加到 `Authorization` 请求头。

## 响应拦截器

### 添加自定义响应拦截器

```typescript
request.useResponseInterceptor((response) => {
  // 处理响应数据
  if (response.code !== 0) {
    console.warn('业务错误:', response.msg)
  }
  return response
})
```

## 文件上传

```typescript
const res = await request.upload({
  url: '/api/upload',
  filePath: '/path/to/file.jpg',
  name: 'file',
  formData: { userId: 123 },
  header: { 'X-Token': 'xxx' }
})
```

## 文件下载

```typescript
const res = await request.download({
  url: '/api/download/file.pdf',
  header: { 'Authorization': 'Bearer xxx' },
  timeout: 120000
})

// 可配合 uni.saveFile 保存文件
uni.saveFile({
  tempFilePath: res.tempFilePath,
  success: (saveRes) => {
    console.log('保存路径:', saveRes.savedFilePath)
  }
})
```

## 响应数据结构

所有请求返回 `Req.ResponseData<T>` 结构：

```typescript
interface ResponseData<T> {
  code: number      // 状态码
  msg: string       // 提示信息
  data: T           // 响应数据
}
```

### 分页数据结构

```typescript
interface pageData<T> {
  total: number         // 总记录数
  list: T[]             // 数据列表
  current_page: number  // 当前页
  last_page: number     // 最后一页
  per_page: number      // 每页条数
}
```

### 使用示例

```typescript
interface User { id: number; name: string }

const res = await request.get<Req.pageData<User>>('/api/users', { page: 1 })
console.log(res.data.total)        // 总数
console.log(res.data.list)         // User[]
console.log(res.data.current_page) // 当前页
```

## 错误处理

内置错误处理会自动弹出 toast 提示：

| 错误码 | 提示文案 |
|--------|----------|
| -1 | 网络连接失败，请检查网络 |
| >= 500 | 服务器开小差了，请稍后重试 |

### 自定义错误处理

可自行 catch 错误：

```typescript
try {
  const res = await request.get('/api/users')
} catch (error) {
  console.error('请求失败:', error.code, error.message)
}
```

## 配置说明

### 默认配置

```typescript
{
  baseURL: conifg.baseUrl,  // 来自 @/config
  timeout: 60000            // 60秒
}
```

### 自定义实例（如需）

当前导出的是单例，如需自定义可修改构造函数：

```typescript
const customRequest = new Request({
  baseURL: 'https://api.example.com',
  timeout: 30000
})
```

## 类型定义位置

- 请求配置: `Req.RequestConfig`
- 上传配置: `Req.UploadConfig`
- 下载配置: `Req.DownloadConfig`
- 响应数据: `Req.ResponseData<T>`
- 分页数据: `Req.pageData<T>`

类型定义文件: `src/types/index.d.ts`

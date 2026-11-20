# AppStore 数据统计

## 统计口径

- 不采集第三方应用的注册、登录、安装或应用内活跃数据。
- 不要求 AppStore 访客注册或登录。
- UV 使用本地持久化的匿名访客 ID 估算；会话 ID 在连续 30 分钟无活动后轮换。
- PV 在应用列表页和应用详情页加载时记录。
- 应用详情访问单独记录为 \`app_detail_view\`。
- 下载统计按有效下载按钮点击计数：每次有效点击记录一次，不等待下载完成或安装成功。
- 搜索统计在用户提交搜索词时记录，并带上当前列表中的匹配结果数。
- 客户端为每个事件生成唯一 \`event_id\`，数据库唯一索引保证重试不会重复计数。

## 隐私边界

- 不采集 AppStore 用户注册资料。
- 不保存请求 IP 或完整 User-Agent。
- 来源只保存分类和来源域名，不保存完整来源 URL。
- 搜索词中疑似邮箱或手机号的内容会被丢弃。

## 数据库升级

现有数据库使用 TypeORM \`synchronize: false\`，部署前需要先执行：

\`\`\`bash
mysql -u <user> -p <database> < node/migrations/20261120_app_analytics.sql
mysql -u <user> -p <database> < node/migrations/20261120_app_analytics_menu_to_index.sql
\`\`\`

该脚本创建事件表，并将现有后台“首页 / 数据统计”（`/index/Index`）菜单指向统计看板。若此前已执行过旧版迁移并生成独立的 `/analytics` 菜单，请再执行 `node/migrations/20261120_app_analytics_menu_to_index.sql`，它会复用现有 `/index/Index` 并软删除旧菜单。

## 事件类型

| event_type | 触发时机 |
| --- | --- |
| \`page_view\` | 应用列表或详情页面加载 |
| \`app_detail_view\` | 应用详情页面加载 |
| \`app_search\` | 用户提交搜索 |
| \`app_download_click\` | 用户点击有效下载按钮 |

统计 API 从原始事件表按所选日期实时聚合，趋势按自然日分组。数据量增长后可在不改变事件口径的前提下增加物化日汇总。

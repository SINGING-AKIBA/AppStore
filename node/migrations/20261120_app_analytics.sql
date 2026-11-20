-- AppStore anonymous analytics events and admin navigation.
-- Run this once against the existing AppStore MySQL database before deploying the new API.

CREATE TABLE IF NOT EXISTS `smile_analytics_event` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `event_id` varchar(64) NOT NULL COMMENT '客户端事件唯一ID',
  `event_type` varchar(32) NOT NULL COMMENT '事件类型',
  `app_info_id` int(10) unsigned DEFAULT NULL COMMENT '应用ID',
  `visitor_id` varchar(64) NOT NULL COMMENT '匿名访客标识',
  `session_id` varchar(64) NOT NULL COMMENT '访问会话标识',
  `platform` varchar(32) NOT NULL DEFAULT 'unknown' COMMENT '运行平台',
  `device_type` varchar(32) NOT NULL DEFAULT 'unknown' COMMENT '设备类型',
  `source` varchar(32) NOT NULL DEFAULT 'direct' COMMENT '访问来源',
  `keyword` varchar(200) DEFAULT NULL COMMENT '搜索关键词',
  `result_count` int(10) unsigned DEFAULT NULL COMMENT '搜索结果数量',
  `page_path` varchar(255) DEFAULT NULL COMMENT '页面路径',
  `referrer` varchar(255) DEFAULT NULL COMMENT '来源域名',
  `create_time` int(10) unsigned NOT NULL COMMENT '事件发生时间',
  `update_time` int(10) unsigned NOT NULL COMMENT '记录更新时间',
  `delete_time` bigint(20) unsigned DEFAULT NULL COMMENT '删除时间',
  `is_delete` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '删除状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_analytics_event_id` (`event_id`),
  KEY `idx_analytics_type_time` (`event_type`, `create_time`),
  KEY `idx_analytics_app_type_time` (`app_info_id`, `event_type`, `create_time`),
  KEY `idx_analytics_visitor_time` (`visitor_id`, `create_time`),
  KEY `idx_analytics_keyword_time` (`keyword`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='AppStore匿名行为事件';

-- Reuse the existing /index/Index dashboard route instead of creating a new menu.
SET @index_menu_id = (
  SELECT id FROM smile_menu
  WHERE path = '/index' AND type = 10 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

SET @index_page_id = (
  SELECT id FROM smile_menu
  WHERE path = '/index/Index' AND type = 20 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

UPDATE smile_menu
SET
  pid = @index_menu_id,
  title = '数据统计',
  icon = 'bar-chart',
  status = 10,
  \`show\` = 10,
  update_time = UNIX_TIMESTAMP()
WHERE id = @index_page_id AND @index_menu_id IS NOT NULL;

INSERT INTO smile_menu
  (type, pid, title, path, icon, weigh, status, target, \`show\`, create_time, update_time, is_delete, delete_time)
SELECT
  20, @index_menu_id, '数据统计', '/index/Index', 'bar-chart', 2, 10, 10, 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0, NULL
WHERE @index_menu_id IS NOT NULL AND @index_page_id IS NULL;

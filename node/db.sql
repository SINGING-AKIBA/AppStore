CREATE TABLE `smile_admin`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录密码',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '姓名',
  `is_super` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否为超级管理员1是0不是',
  `user_id` int(10) UNSIGNED NULL DEFAULT 0,
  `sort` int(10) UNSIGNED NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `is_delete` tinyint(3) UNSIGNED NULL DEFAULT 0 COMMENT '是否删除',
  `delete_time` bigint(20) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `create_time` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员列表' ROW_FORMAT = DYNAMIC;

CREATE TABLE `smile_grade`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '等级ID',
  `name` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '等级名称',
  `icon_image` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '等级图标',
  `min_exp_number` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '所需经验值',
  `benefit_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '权益描述',
  `sort_number` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '排序',
  `is_default_switch` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '默认等级:0=否,1=是',
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 10 COMMENT '状态:10=启用,20=禁用',
  `create_time` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` int(11) NULL DEFAULT NULL COMMENT '更新时间',
  `is_delete` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除:0=未删除,1=已删除',
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_min_exp`(`min_exp_number`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户等级管理' ROW_FORMAT = Dynamic;
CREATE TABLE `smile_menu`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `type` tinyint(4) NOT NULL COMMENT '类型::10=菜单,20=路由,30=操作',
  `pid` int(10) UNSIGNED NOT NULL COMMENT '父级ID',
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `path` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '路径地址',
  `icon` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '图标',
  `weigh` int(11) NOT NULL COMMENT '排序',
  `status` tinyint(4) NOT NULL COMMENT '状态:10=显示,20=隐藏',
  `target` tinyint(4) NOT NULL COMMENT '打开方式:10=_self,20=_blank,30=_top,40=_parent',
  `show` tinyint(4) NOT NULL COMMENT '10显示20隐藏',
  `create_time` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` int(11) NOT NULL COMMENT '更新时间',
  `is_delete` tinyint(3) UNSIGNED NULL DEFAULT 0 COMMENT '是否删除',
  `delete_time` bigint(20) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `title`(`title`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜单表' ROW_FORMAT = DYNAMIC;


CREATE TABLE `smile_oauth`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT '用户ID',
  `oauth_type` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '第三方名称',
  `openid` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '第三方用户唯一标识',
  `unionid` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信unionID',
  `is_delete` tinyint(3) UNSIGNED NOT NULL COMMENT '是否删除',
  `create_time` bigint(20) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` bigint(20) UNSIGNED NOT NULL COMMENT '更新时间',
  `delete_time` bigint(20) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '第三方授权登录' ROW_FORMAT = DYNAMIC;


CREATE TABLE `smile_rules`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ptype` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v0` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v1` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v2` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v3` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v4` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v5` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v6` varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;


CREATE TABLE `smile_settings`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置标题',
  `values` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '配置json数据',
  `describe` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '配置描述',
  `create_time` bigint(20) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` bigint(20) UNSIGNED NOT NULL COMMENT '更新时间',
  `is_delete` tinyint(3) UNSIGNED NULL DEFAULT 0 COMMENT '是否删除',
  `delete_time` bigint(20) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `key`(`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统配置' ROW_FORMAT = DYNAMIC;

CREATE TABLE `smile_sms_records`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '短信记录ID',
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '短信内容',
  `type` enum('1','2','3','4') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '短信类型:1=验证码,2=通知短信,3=营销短信,4=系统消息',
  `status` enum('10','20','30') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发送状态:10=待发送,20=发送成功,30=发送失败',
  `success_switch` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否成功:0=失败,1=成功',
  `templateId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '短信模板ID',
  `result_textarea` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '返回结果信息',
  `user_id` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '用户ID',
  `platform` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '短信平台',
  `create_time` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '添加时间',
  `update_time` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `is_delete` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除:0=未删除,1=已删除',
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_mobile`(`mobile`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_type`(`type`) USING BTREE,
  INDEX `idx_create_time`(`create_time`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '短信发送记录' ROW_FORMAT = DYNAMIC;


CREATE TABLE `smile_uploads`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `group_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件分组ID',
  `channel` tinyint(3) UNSIGNED NOT NULL DEFAULT 10 COMMENT '上传来源(10总后台,20商户后台,30客户端)',
  `storage` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '存储方式',
  `domain` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '存储域名',
  `type` tinyint(3) UNSIGNED NOT NULL COMMENT '文件类型(10图片 20附件 30视频)',
  `name` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件名称',
  `path` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件路径',
  `size` int(10) UNSIGNED NOT NULL COMMENT '文件大小(字节)',
  `ext` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件扩展名',
  `cover` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '文件封面',
  `user_id` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID',
  `is_recycle` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否在回收站(0不是10是）',
  `is_delete` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除(0未删除10已删除）',
  `create_time` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` int(10) UNSIGNED NOT NULL COMMENT '更新时间',
  `delete_time` int(11) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文件上传' ROW_FORMAT = DYNAMIC;

CREATE TABLE `smile_uploads_group`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分组ID',
  `name` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分组名称',
  `pid` int(10) UNSIGNED NOT NULL COMMENT '上级分组ID',
  `sort` int(10) UNSIGNED NOT NULL COMMENT '排序(数字越小越靠前)',
  `is_delete` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除(0未删除10已删除）',
  `create_time` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` int(10) UNSIGNED NOT NULL COMMENT '更新时间',
  `delete_time` int(11) NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文件上传分组' ROW_FORMAT = DYNAMIC;

CREATE TABLE `smile_user`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `nick_name` varchar(765) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户昵称',
  `gender` enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '性别:0=保密,1=男,2=女',
  `platform` enum('H5','APP','MP-WEIXIN','MP-TOUTIAO','MP-ALIPAY') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '注册来源:H5=web,APP=app,MP-WEIXIN=微信小程序,MP-ALIPAY=支付宝小程序,MP-TOUTIAO=抖音小程序,MP-QQ=QQ小程序,MP-KUAISHOU=快手小程序',
  `avatar_img` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '头像图片ID',
  `country` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '国家',
  `province` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '省份',
  `city` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '城市',
  `balance` decimal(12, 2) UNSIGNED NULL DEFAULT 0.00 COMMENT '用户可用余额',
  `points` int(10) UNSIGNED NULL DEFAULT 0 COMMENT '用户可用K点',
  `mobile` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户手机号',
  `real_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `grade_id` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '会员等级ID',
  `last_login_time` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '最后登录IP',
  `status` tinyint(4) NULL DEFAULT NULL COMMENT '用户状态:10=正常,20=拉黑',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '拉黑原因',
  `schools_id` int(10) UNSIGNED NULL DEFAULT 0 COMMENT '主体',
  `teams_id` int(11) NULL DEFAULT 0 COMMENT '团队',
  `position` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '职位',
  `is_delete` tinyint(3) UNSIGNED NULL DEFAULT NULL COMMENT '是否删除',
  `create_time` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `delete_time` bigint(20) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `nick_name`(`mobile`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员列表' ROW_FORMAT = DYNAMIC;

CREATE TABLE `smile_user_grade`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL COMMENT '用户',
  `grade_id` int(10) UNSIGNED NOT NULL COMMENT '会员等级',
  `start_time` int(10) UNSIGNED NOT NULL COMMENT '生效时间',
  `end_time` int(10) UNSIGNED NOT NULL COMMENT '结束时间',
  `create_time` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `update_time` int(10) UNSIGNED NOT NULL COMMENT '更新时间',
  `is_delete` tinyint(3) UNSIGNED NULL DEFAULT 0 COMMENT '是否删除',
  `delete_time` bigint(20) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员等级记录' ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `smile_admin` (`id`, `username`, `password`, `real_name`, `is_super`, `user_id`, `sort`, `is_delete`, `delete_time`, `create_time`, `update_time`) VALUES (1, 'admin', '$2b$10$tQ1YtLpQnhdGTtTpNsIpxuAah/2mvt.sviUwBv1h2P4msZKx033hG', '系统管理员', 1, 1, 100, 0, NULL, 1614556800, 1662362128);

INSERT INTO `smile_admin` (`id`, `username`, `password`, `real_name`, `is_super`, `user_id`, `sort`, `is_delete`, `delete_time`, `create_time`, `update_time`) VALUES (2, 'smile', '$2y$10$gy2Gh53OHiVD4Z9l8BxHnuEJKx5Mt3zqv2FsVJkjnwyh9zB55IRB2', '普通管理员', 0, 1, 100, 0, NULL, 1657793906, 1763705204);

INSERT INTO `smile_admin` (`id`, `username`, `password`, `real_name`, `is_super`, `user_id`, `sort`, `is_delete`, `delete_time`, `create_time`, `update_time`) VALUES (3, 'singing', '$2y$10$Fkp4RX1lDN4eVPJlcDbyu.GyWlfB7ZCBFpO0jOnzfQt2Q7et19gUy', '123456', 0, 1, 100, 1, NULL, 1677050142, 1677050142);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (39, 10, 11, '缓存管理', '/setting/Cache', '', 10, 10, 10, 10, 1651228921, 1651228921, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (47, 10, 0, '管理员', '/admin', 'admin', 2, 10, 10, 10, 1651288308, 1657352206, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (48, 20, 47, '更改密码', '/admin/Settings', '', 2, 10, 10, 20, 1651288545, 1651919603, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (49, 20, 47, '管理列表', '/admin/Index', '', 1, 10, 10, 10, 1651288828, 1651919589, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (54, 10, 0, '系统设置', '/setting', 'setting', 5, 10, 10, 10, 1651298373, 1736146038, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (57, 20, 54, '上传配置', '/setting/Upload', '', 10, 10, 10, 10, 1651298993, 1652692514, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (58, 20, 54, '短信配置', '/setting/Sms', '', 10, 10, 10, 10, 1651299156, 1651299156, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (63, 10, 0, '首页', '/index', 'home', 1, 10, 10, 10, 1652774670, 1736092894, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (64, 20, 63, '数据看板', '/index/Index', '', 2, 10, 10, 10, 1652775376, 1738897508, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (67, 10, 0, '文件管理', '/file', 'file', 3, 10, 10, 10, 1652924961, 1736145971, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (68, 20, 67, '文件列表', '/file/Index', '', 10, 10, 10, 10, 1652925007, 1652925062, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (69, 20, 67, '文件分组', '/file/Group', '', 20, 10, 10, 10, 1652925180, 1652925180, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (106, 20, 54, '城市列表', '/region/Index', '', 80, 20, 10, 10, 1658134789, 1663141129, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (107, 30, 106, '编辑', '/region/Edit', '', 100, 10, 10, 20, 1658136702, 1658136702, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (134, 20, 54, '隐私协议配置', '/setting/Agreement', '', 10, 10, 10, 10, 1662436493, 1738723047, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (158, 20, 63, '环境检查', '/index/Environment', '', 33, 10, 10, 10, 1652406758, 1652406758, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (159, 20, 47, '菜单管理', '/menu/Index', '', 2, 10, 10, 10, 1651288828, 1651919589, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (160, 30, 159, '新增', '/menu/Add', '', 3, 10, 10, 20, 1652005170, 1736092470, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (161, 30, 159, '编辑', '/menu/Edit', '', 100, 10, 10, 20, 1736091661, 1736091661, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (183, 20, 47, '角色管理', '/role/Index', '', 100, 10, 10, 10, 1738641451, 1738641451, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (635, 20, 54, '队列管理', '/queue/Index', '', 100, 10, 10, 10, 1774862331, 1774862331, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (636, 30, 635, '添加', '/queue/Add', '', 100, 10, 10, 20, 1774875160, 1774875160, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (637, 30, 635, '更新', '/queue/Update', '', 100, 10, 10, 20, 1774875182, 1774875182, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (638, 30, 635, '详情', '/queue/Detail', '', 100, 10, 10, 20, 1774875209, 1774875209, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (803, 10, 0, '用户管理', '/user', 'user', 10, 10, 10, 10, 1778135889, 1778135889, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (804, 20, 803, '会员列表', '/user/Index', '', 100, 10, 10, 10, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (805, 30, 804, '添加', '/user/Add', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (806, 30, 804, '编辑', '/user/Update', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (807, 30, 804, '删除', '/user/Delete', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (808, 30, 804, '详情', '/user/Detail', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (809, 30, 804, '选择', '/user/Select', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (810, 30, 804, '导出', '/user/Export', '', 100, 10, 10, 20, 1778136900, 1778136900, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (811, 20, 803, '用户等级管理', '/grade/Index', '', 100, 10, 10, 10, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (812, 30, 811, '添加', '/grade/Add', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (813, 30, 811, '编辑', '/grade/Update', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (814, 30, 811, '删除', '/grade/Delete', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (815, 30, 811, '详情', '/grade/Detail', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (816, 30, 811, '选择', '/grade/Select', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);

INSERT INTO `smile_menu` (`id`, `type`, `pid`, `title`, `path`, `icon`, `weigh`, `status`, `target`, `show`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES (817, 30, 811, '导出', '/grade/Export', '', 100, 10, 10, 20, 1778137821, 1778137821, 0, NULL);


INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (4, 'g', 'admin', '开发', NULL, NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (5, 'p', '开发', 'category', 'add', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (6, 'p', '开发', 'category', 'smile', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (7, 'p', '开发', 'index', 'smile', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (8, 'p', '开发', 'index', 'environment', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (9, 'p', '开发', 'index', 'index', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (10, 'p', '开发', 'admin', 'smile', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (11, 'p', '开发', 'admin', 'index', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (12, 'p', '开发', 'admin', 'settings', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (13, 'p', '开发', 'menu', 'index', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (14, 'p', '开发', 'role', 'index', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (15, 'p', '开发', 'menu', 'add', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (16, 'p', '开发', 'menu', 'edit', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (17, 'p', '开发', 'category', 'index', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (18, 'p', '开发', 'category', 'update', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (19, 'p', '开发', 'category', 'delete', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (20, 'p', '开发', 'category', 'detail', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (21, 'p', '开发', 'category', 'select', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (22, 'p', '开发', 'category', 'export', NULL, NULL, NULL, NULL);

INSERT INTO `smile_rules` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (23, 'g', 'singing', '开发', NULL, NULL, NULL, NULL, NULL);

INSERT INTO `smile_uploads_group` (`id`, `name`, `pid`, `sort`, `is_delete`, `create_time`, `update_time`, `delete_time`) VALUES (1, '营业执照', 0, 100, 0, 1780367804, 1780367804, 0);

INSERT INTO `smile_user` (`id`, `nick_name`, `gender`, `platform`, `avatar_img`, `country`, `province`, `city`, `balance`, `points`, `mobile`, `real_name`, `grade_id`, `last_login_time`, `last_login_ip`, `status`, `message`, `schools_id`, `teams_id`, `position`, `is_delete`, `create_time`, `update_time`, `delete_time`) VALUES (1, 'smile', '1', 'APP', 9, '中国', '广东', '广州', 10000.00, 1000, '13588888888', 'smile', 0, 1738588859, '::ffff:127.0.0.1', 10, NULL, 1928, 4437, NULL, 0, 1738588859, 1738906367, NULL);


CREATE TABLE `smile_app_info` (
    `id`            int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'APP ID',
    `name`          varchar(200) NOT NULL COMMENT '应用名称',
    `app_key`       varchar(100) NOT NULL COMMENT '应用唯一标识键',
    `subtitle`      varchar(300) DEFAULT NULL COMMENT '副标题/标语',
    `icon`          varchar(500) DEFAULT NULL COMMENT '应用图标URL',
    `company`       varchar(200) DEFAULT NULL COMMENT '开发商/公司名称',
    `description`   text DEFAULT NULL COMMENT '应用描述',
    `category`      varchar(500) DEFAULT NULL COMMENT '分类',
    `age_rating`    varchar(20) DEFAULT '4+' COMMENT '年龄评级:4+=4+,9+=9+,12+=12+,17+=17+',
    `rating`        decimal(2,1) unsigned NOT NULL DEFAULT 0.0 COMMENT '用户评分（0.0-5.0）',
    `rating_count`  int(11) unsigned NOT NULL DEFAULT 0 COMMENT '评分数',
    `copyright`     varchar(200) DEFAULT NULL COMMENT '版权信息',
    `privacy_url`   varchar(500) DEFAULT NULL COMMENT '隐私政策链接',
    `terms_url`     varchar(500) DEFAULT NULL COMMENT '服务条款链接',
    `support_url`   varchar(500) DEFAULT NULL COMMENT '联系我们/技术支持链接',
    `status`        tinyint(3) unsigned NOT NULL DEFAULT 10 COMMENT '状态:10=上架,20=下架',
    `sort_order`    int(11) unsigned NOT NULL DEFAULT 0 COMMENT '排序权重',
    `create_time`   int(11) DEFAULT NULL COMMENT '添加时间',
    `update_time`   int(11) DEFAULT NULL COMMENT '更新时间',
    `is_delete`     tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除:0=未删除,1=已删除',
    `delete_time`   timestamp NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_app_key` (`app_key`) USING BTREE,
    KEY `idx_status_sort` (`status`, `sort_order` DESC) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='APP信息管理:hasMany=app_screenshot|app_version';
CREATE TABLE `smile_app_version` (
    `id`                int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '版本ID',
    `app_info_id`       int(11) unsigned NOT NULL COMMENT 'APP ID',
    `version`           varchar(20) NOT NULL COMMENT '版本号',
    `version_code`      int(11) unsigned DEFAULT NULL COMMENT '内部版本号',
    `size`              varchar(20) DEFAULT NULL COMMENT '安装包大小，如 "42.5 MB"',
    `min_os_ios`        varchar(20) DEFAULT '12.0' COMMENT 'iOS最低支持版本',
    `min_os_android`    varchar(20) DEFAULT '6.0' COMMENT 'Android最低支持版本',
    `ios_url`           varchar(500) DEFAULT NULL COMMENT 'iOS App Store下载链接',
    `ios_appstore`   varchar(50) DEFAULT NULL COMMENT 'iOS App Store ID',
    `android_url`       varchar(500) DEFAULT NULL COMMENT 'Android APK下载链接',
    `changelog`         text DEFAULT NULL COMMENT '更新日志/新特性说明',
    `platform`          varchar(44) NOT NULL DEFAULT 'android' COMMENT '适用平台:ios=iOS,android=安卓',
    `force_update_switch` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '强制更新开关:0=非强制,1=强制',
    `status`            tinyint(3) unsigned NOT NULL DEFAULT 10 COMMENT '状态:10=草稿,20=已发布,30=已回滚',
    `publish_time`      datetime DEFAULT NULL COMMENT '发布时间',
    `create_time`       int(11) DEFAULT NULL COMMENT '添加时间',
    `update_time`       int(11) DEFAULT NULL COMMENT '更新时间',
    `is_delete`         tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除:0=未删除,1=已删除',
    `delete_time`       timestamp NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_app_version` (`app_info_id`, `version`) USING BTREE,
    KEY `idx_app_status` (`app_info_id`, `status`, `publish_time` DESC) USING BTREE,
    KEY `idx_version_code` (`app_info_id`, `version_code` DESC) USING BTREE,
    KEY `idx_publish_time` (`publish_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='版本管理表:belongsTo=app_info';
CREATE TABLE `smile_app_screenshot` (
    `id`            int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '截图ID',
    `app_info_id`   int(11) unsigned NOT NULL COMMENT 'APP ID',
    `image`         varchar(500) NOT NULL COMMENT '截图图片URL',
    `platform`      enum('ios','android') NOT NULL DEFAULT 'android' COMMENT '适用平台:ios=iOS,android=安卓',
    `sort_order`    int(11) unsigned NOT NULL DEFAULT 0 COMMENT '排序（升序）',
    `create_time`   int(11) DEFAULT NULL COMMENT '添加时间',
    `update_time`   int(11) DEFAULT NULL COMMENT '更新时间',
    `is_delete`     tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除:0=未删除,1=已删除',
    `delete_time`   timestamp NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_app_platform` (`app_info_id`, `platform`) USING BTREE,
    KEY `idx_sort` (`app_info_id`, `sort_order`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='APP截图表:belongsTo=app_info';

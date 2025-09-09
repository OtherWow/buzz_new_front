-- ===========================================
-- 角色权限管理系统 - 数据库创建脚本
-- ===========================================

-- 1. 创建角色表
CREATE TABLE `bo_base_roles` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(100) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) NOT NULL COMMENT '角色代码',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `is_active` tinyint NOT NULL DEFAULT '1' COMMENT '是否激活 0.禁用 1.启用',
  `is_system` tinyint NOT NULL DEFAULT '0' COMMENT '是否系统角色 0.否 1.是（系统角色不可删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`role_name`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 2. 创建权限表
CREATE TABLE `bo_base_permissions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `permission_name` varchar(100) NOT NULL COMMENT '权限名称',
  `permission_code` varchar(100) NOT NULL COMMENT '权限代码',
  `resource_type` varchar(50) NOT NULL DEFAULT 'menu' COMMENT '资源类型 menu/button/api',
  `parent_id` int NOT NULL DEFAULT '0' COMMENT '父级权限ID',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序',
  `description` varchar(255) DEFAULT NULL COMMENT '权限描述',
  `is_active` tinyint NOT NULL DEFAULT '1' COMMENT '是否激活 0.禁用 1.启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_resource_type` (`resource_type`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 3. 创建角色权限关联表
CREATE TABLE `bo_role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` int NOT NULL COMMENT '角色ID',
  `permission_id` int NOT NULL COMMENT '权限ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`,`permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`),
  CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_id`) REFERENCES `bo_base_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `bo_base_permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 4. 修改用户表，添加角色字段
ALTER TABLE `bo_base_users` 
ADD COLUMN `role_id` int DEFAULT 4 COMMENT '用户角色ID，默认为普通用户' AFTER `user_partner`;

-- 添加外键约束
ALTER TABLE `bo_base_users` 
ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `bo_base_roles` (`id`) ON UPDATE CASCADE;

-- ===========================================
-- 初始化角色数据
-- ===========================================

-- 插入默认角色
INSERT INTO `bo_base_roles` (`id`, `role_name`, `role_code`, `description`, `is_active`, `is_system`) VALUES
(1, '系统管理员', 'admin', '拥有系统全部功能权限', 1, 1),
(2, 'SVIP用户', 'svip', 'SVIP级别用户，预留扩展权限', 1, 1),
(3, 'VIP用户', 'vip', 'VIP级别用户，预留扩展权限', 1, 1),
(4, '普通用户', 'user', '普通用户，拥有基础功能权限', 1, 1);

-- ===========================================
-- 初始化权限数据
-- ===========================================

-- 基础权限
INSERT INTO `bo_base_permissions` (`id`, `permission_name`, `permission_code`, `resource_type`, `parent_id`, `sort_order`, `description`) VALUES
(1, '系统首页', 'dashboard:read', 'menu', 0, 1, '访问系统首页'),
(2, '免责声明', 'disclaimer:read', 'menu', 0, 9, '查看免责声明页面');

-- 交易所管理权限
INSERT INTO `bo_base_permissions` (`id`, `permission_name`, `permission_code`, `resource_type`, `parent_id`, `sort_order`, `description`) VALUES
(10, '交易所管理', 'exchange:read', 'menu', 0, 2, '交易所管理总权限'),
(11, '交易查询', 'exchange:trade_query', 'menu', 10, 1, '查询交易记录'),
(12, '余额查询', 'exchange:balance_query', 'menu', 10, 2, '查询账户余额'),
(13, '资金动态', 'exchange:fund_flow', 'menu', 10, 3, '查看资金流动'),
(14, '盈亏分析', 'exchange:profit_analysis', 'menu', 10, 4, '查看盈亏分析');

-- 马丁策略管理权限
INSERT INTO `bo_base_permissions` (`id`, `permission_name`, `permission_code`, `resource_type`, `parent_id`, `sort_order`, `description`) VALUES
(20, '马丁策略管理', 'martin:read', 'menu', 0, 3, '马丁策略管理总权限'),
(21, '马丁策略列表', 'martin:strategy_list', 'menu', 20, 1, '查看马丁策略列表'),
(22, '马丁监控器', 'martin:monitor', 'menu', 20, 2, '马丁策略监控');

-- 系统管理权限（仅管理员）
INSERT INTO `bo_base_permissions` (`id`, `permission_name`, `permission_code`, `resource_type`, `parent_id`, `sort_order`, `description`) VALUES
(30, '用户管理', 'user:read', 'menu', 0, 4, '用户管理页面'),
(31, '创建用户', 'user:create', 'button', 30, 1, '创建新用户'),
(32, '编辑用户', 'user:update', 'button', 30, 2, '编辑用户信息'),
(33, '删除用户', 'user:delete', 'button', 30, 3, '删除用户'),

(40, '角色管理', 'role:read', 'menu', 0, 5, '角色管理页面'),
(41, '创建角色', 'role:create', 'button', 40, 1, '创建新角色'),
(42, '编辑角色', 'role:update', 'button', 40, 2, '编辑角色信息'),
(43, '删除角色', 'role:delete', 'button', 40, 3, '删除角色'),

(50, '权限管理', 'permission:read', 'menu', 0, 6, '权限管理页面'),
(51, '创建权限', 'permission:create', 'button', 50, 1, '创建新权限'),
(52, '编辑权限', 'permission:update', 'button', 50, 2, '编辑权限信息'),
(53, '删除权限', 'permission:delete', 'button', 50, 3, '删除权限');

-- ===========================================
-- 初始化角色权限关联数据
-- ===========================================

-- 系统管理员 - 拥有所有权限
INSERT INTO `bo_role_permissions` (`role_id`, `permission_id`) VALUES
-- 基础权限
(1, 1), (1, 2),
-- 交易所管理权限
(1, 10), (1, 11), (1, 12), (1, 13), (1, 14),
-- 马丁策略权限
(1, 20), (1, 21), (1, 22),
-- 用户管理权限
(1, 30), (1, 31), (1, 32), (1, 33),
-- 角色管理权限
(1, 40), (1, 41), (1, 42), (1, 43),
-- 权限管理权限
(1, 50), (1, 51), (1, 52), (1, 53);

-- SVIP用户 - 基础功能权限
INSERT INTO `bo_role_permissions` (`role_id`, `permission_id`) VALUES
-- 基础权限
(2, 1), (2, 2),
-- 交易所管理权限
(2, 10), (2, 11), (2, 12), (2, 13), (2, 14),
-- 马丁策略权限  
(2, 20), (2, 21), (2, 22);

-- VIP用户 - 基础功能权限
INSERT INTO `bo_role_permissions` (`role_id`, `permission_id`) VALUES
-- 基础权限
(3, 1), (3, 2),
-- 交易所管理权限
(3, 10), (3, 11), (3, 12), (3, 13), (3, 14),
-- 马丁策略权限
(3, 20), (3, 21), (3, 22);

-- 普通用户 - 基础功能权限
INSERT INTO `bo_role_permissions` (`role_id`, `permission_id`) VALUES
-- 基础权限
(4, 1), (4, 2),
-- 交易所管理权限
(4, 10), (4, 11), (4, 12), (4, 13), (4, 14),
-- 马丁策略权限
(4, 20), (4, 21), (4, 22);

-- ===========================================
-- 数据验证和索引优化
-- ===========================================

-- 为用户表的role_id字段添加索引
ALTER TABLE `bo_base_users` ADD INDEX `idx_role_id` (`role_id`);

-- 验证数据完整性
SELECT 
  r.role_name,
  COUNT(rp.permission_id) as permission_count
FROM bo_base_roles r 
LEFT JOIN bo_role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.role_name
ORDER BY r.id;

-- 验证权限层级结构
SELECT 
  p1.permission_name as parent_permission,
  p2.permission_name as child_permission,
  p2.permission_code
FROM bo_base_permissions p1
RIGHT JOIN bo_base_permissions p2 ON p1.id = p2.parent_id
ORDER BY p1.sort_order, p2.sort_order;

-- ===========================================
-- 更新现有用户的角色（根据实际情况调整）
-- ===========================================

-- 将现有用户默认设置为普通用户
UPDATE `bo_base_users` SET `role_id` = 4 WHERE `role_id` IS NULL;

-- 设置管理员用户（根据实际用户名调整）
-- UPDATE `bo_base_users` SET `role_id` = 1 WHERE `username` IN ('admin', 'administrator');

-- 根据现有业务逻辑设置VIP用户（如果有相关字段标识）
-- UPDATE `bo_base_users` SET `role_id` = 3 WHERE `user_level` = 'vip' OR `user_partner` = 'vip';
-- UPDATE `bo_base_users` SET `role_id` = 2 WHERE `user_level` = 'svip' OR `user_partner` = 'svip';

-- ===========================================
-- 完成提示
-- ===========================================
SELECT '角色权限系统初始化完成！' as message;
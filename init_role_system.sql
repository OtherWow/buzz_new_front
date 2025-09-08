-- 角色权限系统初始化脚本

-- 1. 创建角色表
CREATE TABLE IF NOT EXISTS bo_roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '角色名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(500) COMMENT '角色描述',
    level INT DEFAULT 1 COMMENT '角色级别，数字越小权限越高',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用 0.禁用 1.启用',
    is_system TINYINT DEFAULT 0 COMMENT '是否系统角色 0.否 1.是（系统角色不可删除）',
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日期',
    INDEX idx_code (code),
    INDEX idx_level (level)
) COMMENT='角色表';

-- 2. 创建权限表
CREATE TABLE IF NOT EXISTS bo_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    name VARCHAR(100) NOT NULL COMMENT '权限名称',
    code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码',
    resource VARCHAR(100) NOT NULL COMMENT '资源名称',
    action VARCHAR(50) NOT NULL COMMENT '操作类型',
    description VARCHAR(500) COMMENT '权限描述',
    module VARCHAR(50) NOT NULL COMMENT '所属模块',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用 0.禁用 1.启用',
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日期',
    INDEX idx_code (code),
    INDEX idx_module (module),
    INDEX idx_resource_action (resource, action)
) COMMENT='权限表';

-- 3. 创建角色权限关联表
CREATE TABLE IF NOT EXISTS bo_role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    role_id INT NOT NULL COMMENT '角色ID',
    permission_id INT NOT NULL COMMENT '权限ID',
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
    FOREIGN KEY (role_id) REFERENCES bo_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES bo_permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_permission (role_id, permission_id)
) COMMENT='角色权限关联表';

-- 4. 创建用户角色关联表
CREATE TABLE IF NOT EXISTS bo_user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id INT NOT NULL COMMENT '用户ID',
    role_id INT NOT NULL COMMENT '角色ID',
    is_current TINYINT DEFAULT 0 COMMENT '是否当前使用角色 0.否 1.是',
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '分配日期',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日期',
    FOREIGN KEY (user_id) REFERENCES bo_base_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES bo_roles(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_current (is_current)
) COMMENT='用户角色关联表';

-- 5. 创建菜单表
CREATE TABLE IF NOT EXISTS bo_menus (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '菜单ID',
    name VARCHAR(100) NOT NULL COMMENT '菜单名称',
    path VARCHAR(200) NOT NULL COMMENT '菜单路径',
    component VARCHAR(200) COMMENT '组件路径',
    icon VARCHAR(100) COMMENT '菜单图标',
    parent_id INT DEFAULT 0 COMMENT '父菜单ID，0表示根菜单',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    permission_code VARCHAR(100) COMMENT '所需权限编码',
    is_visible TINYINT DEFAULT 1 COMMENT '是否可见 0.隐藏 1.显示',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用 0.禁用 1.启用',
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日期',
    INDEX idx_parent_id (parent_id),
    INDEX idx_permission_code (permission_code),
    INDEX idx_sort_order (sort_order)
) COMMENT='菜单表';

-- ===== 初始化基础数据 =====

-- 插入基础角色
INSERT INTO bo_roles (name, code, description, level, is_system) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限', 0, 1),
('管理员', 'ADMIN', '系统管理员，拥有大部分管理权限', 1, 1),
('操作员', 'OPERATOR', '系统操作员，拥有基本操作权限', 2, 1),
('普通用户', 'USER', '普通用户，拥有基础查看权限', 3, 1);

-- 插入基础权限
INSERT INTO bo_permissions (name, code, resource, action, module, description) VALUES
-- 用户管理权限
('查看用户列表', 'USER_VIEW', 'user', 'view', 'user', '查看用户列表的权限'),
('创建用户', 'USER_CREATE', 'user', 'create', 'user', '创建新用户的权限'),
('编辑用户', 'USER_EDIT', 'user', 'edit', 'user', '编辑用户信息的权限'),
('删除用户', 'USER_DELETE', 'user', 'delete', 'user', '删除用户的权限'),

-- 角色管理权限
('查看角色列表', 'ROLE_VIEW', 'role', 'view', 'role', '查看角色列表的权限'),
('创建角色', 'ROLE_CREATE', 'role', 'create', 'role', '创建新角色的权限'),
('编辑角色', 'ROLE_EDIT', 'role', 'edit', 'role', '编辑角色信息的权限'),
('删除角色', 'ROLE_DELETE', 'role', 'delete', 'role', '删除角色的权限'),
('分配权限', 'ROLE_ASSIGN_PERMISSION', 'role', 'assign', 'role', '为角色分配权限的权限'),

-- 权限管理权限
('查看权限列表', 'PERMISSION_VIEW', 'permission', 'view', 'permission', '查看权限列表的权限'),
('创建权限', 'PERMISSION_CREATE', 'permission', 'create', 'permission', '创建新权限的权限'),
('编辑权限', 'PERMISSION_EDIT', 'permission', 'edit', 'permission', '编辑权限信息的权限'),
('删除权限', 'PERMISSION_DELETE', 'permission', 'delete', 'permission', '删除权限的权限'),

-- 交易管理权限
('查看交易列表', 'TRANSACTION_VIEW', 'transaction', 'view', 'transaction', '查看交易列表的权限'),
('创建交易', 'TRANSACTION_CREATE', 'transaction', 'create', 'transaction', '创建新交易的权限'),
('编辑交易', 'TRANSACTION_EDIT', 'transaction', 'edit', 'transaction', '编辑交易信息的权限'),
('删除交易', 'TRANSACTION_DELETE', 'transaction', 'delete', 'transaction', '删除交易的权限'),
('审核交易', 'TRANSACTION_AUDIT', 'transaction', 'audit', 'transaction', '审核交易的权限'),

-- 系统设置权限
('查看系统设置', 'SETTING_VIEW', 'setting', 'view', 'setting', '查看系统设置的权限'),
('修改系统设置', 'SETTING_EDIT', 'setting', 'edit', 'setting', '修改系统设置的权限'),

-- 个人资料权限
('查看个人资料', 'PROFILE_VIEW', 'profile', 'view', 'profile', '查看个人资料的权限'),
('编辑个人资料', 'PROFILE_EDIT', 'profile', 'edit', 'profile', '编辑个人资料的权限'),

-- 仪表板权限
('查看仪表板', 'DASHBOARD_VIEW', 'dashboard', 'view', 'dashboard', '查看仪表板的权限');

-- 为超级管理员分配所有权限
INSERT INTO bo_role_permissions (role_id, permission_id)
SELECT 1, id FROM bo_permissions WHERE is_active = 1;

-- 为管理员分配管理权限（除了系统级权限）
INSERT INTO bo_role_permissions (role_id, permission_id)
SELECT 2, id FROM bo_permissions 
WHERE code IN (
    'USER_VIEW', 'USER_CREATE', 'USER_EDIT',
    'ROLE_VIEW', 'ROLE_CREATE', 'ROLE_EDIT', 'ROLE_ASSIGN_PERMISSION',
    'PERMISSION_VIEW',
    'TRANSACTION_VIEW', 'TRANSACTION_CREATE', 'TRANSACTION_EDIT', 'TRANSACTION_AUDIT',
    'SETTING_VIEW', 'SETTING_EDIT',
    'PROFILE_VIEW', 'PROFILE_EDIT',
    'DASHBOARD_VIEW'
);

-- 为操作员分配操作权限
INSERT INTO bo_role_permissions (role_id, permission_id)
SELECT 3, id FROM bo_permissions 
WHERE code IN (
    'USER_VIEW',
    'ROLE_VIEW',
    'PERMISSION_VIEW',
    'TRANSACTION_VIEW', 'TRANSACTION_CREATE', 'TRANSACTION_EDIT',
    'PROFILE_VIEW', 'PROFILE_EDIT',
    'DASHBOARD_VIEW'
);

-- 为普通用户分配基础权限
INSERT INTO bo_role_permissions (role_id, permission_id)
SELECT 4, id FROM bo_permissions 
WHERE code IN (
    'TRANSACTION_VIEW',
    'PROFILE_VIEW', 'PROFILE_EDIT',
    'DASHBOARD_VIEW'
);

-- 插入基础菜单
INSERT INTO bo_menus (name, path, component, icon, parent_id, sort_order, permission_code) VALUES
-- 一级菜单
('仪表板', '/dashboard', 'Dashboard', 'dashboard', 0, 1, 'DASHBOARD_VIEW'),
('用户管理', '/users', NULL, 'user', 0, 2, 'USER_VIEW'),
('角色管理', '/roles', NULL, 'role', 0, 3, 'ROLE_VIEW'),
('权限管理', '/permissions', NULL, 'permission', 0, 4, 'PERMISSION_VIEW'),
('交易管理', '/transactions', NULL, 'transaction', 0, 5, 'TRANSACTION_VIEW'),
('系统设置', '/settings', NULL, 'setting', 0, 6, 'SETTING_VIEW'),
('个人资料', '/profile', 'Profile', 'user-circle', 0, 7, 'PROFILE_VIEW'),

-- 用户管理子菜单
('用户列表', '/users/index', 'users/index', NULL, 2, 1, 'USER_VIEW'),

-- 角色管理子菜单
('角色列表', '/roles/index', 'roles/index', NULL, 3, 1, 'ROLE_VIEW'),

-- 权限管理子菜单
('权限列表', '/permissions/index', 'permissions/index', NULL, 4, 1, 'PERMISSION_VIEW'),

-- 交易管理子菜单
('交易列表', '/transactions/index', 'transactions/index', NULL, 5, 1, 'TRANSACTION_VIEW'),
('创建交易', '/transactions/create', 'transactions/create', NULL, 5, 2, 'TRANSACTION_CREATE'),

-- 系统设置子菜单
('系统配置', '/settings/index', 'settings/index', NULL, 6, 1, 'SETTING_VIEW'); 
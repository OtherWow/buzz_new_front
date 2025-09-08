# 多角色交易管理系统 FastAPI 接口文档

## 概述

本文档描述了多角色交易管理系统的后端API接口规范。系统基于FastAPI框架开发，支持多角色权限管理和交易管理功能。

## 基础信息

- 基础URL: `http://localhost:8000`
- 认证方式: Bearer Token (JWT)
- 响应格式: JSON

## 通用响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "size": 20,
    "pages": 5
  }
}
```

## 1. 认证相关接口

### 1.1 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录获取访问令牌
- **请求体**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "real_name": "系统管理员",
      "is_active": true,
      "role_id": 1,
      "role": {
        "id": 1,
        "name": "系统管理员",
        "description": "拥有所有权限",
        "permissions": [
          {
            "id": 1,
            "name": "用户管理读取",
            "code": "user:read",
            "resource": "user",
            "action": "read"
          }
        ]
      },
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  }
}
```

### 1.2 获取当前用户信息
- **接口**: `GET /auth/me`
- **描述**: 获取当前登录用户的详细信息
- **请求头**: `Authorization: Bearer {token}`
- **响应**: 同登录接口中的user对象

### 1.3 刷新Token
- **接口**: `POST /auth/refresh`
- **描述**: 刷新访问令牌
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "new_token_here"
  }
}
```

### 1.4 修改密码
- **接口**: `POST /auth/change-password`
- **描述**: 修改当前用户密码
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
```json
{
  "old_password": "old123",
  "new_password": "new123"
}
```

### 1.5 用户登出
- **接口**: `POST /auth/logout`
- **描述**: 用户登出（可选实现，用于记录日志）
- **请求头**: `Authorization: Bearer {token}`

## 2. 用户管理接口

### 2.1 获取用户列表
- **接口**: `GET /users`
- **权限**: `user:read`
- **参数**:
  - `page`: 页码 (default: 1)
  - `size`: 每页数量 (default: 20)
  - `keyword`: 搜索关键词
  - `role_id`: 角色ID筛选
  - `is_active`: 是否激活状态筛选
- **响应**: 分页用户列表

### 2.2 创建用户
- **接口**: `POST /users`
- **权限**: `user:create`
- **请求体**:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "real_name": "真实姓名",
  "phone": "13800138000",
  "role_id": 2,
  "is_active": true
}
```

### 2.3 获取用户详情
- **接口**: `GET /users/{user_id}`
- **权限**: `user:read`

### 2.4 更新用户
- **接口**: `PUT /users/{user_id}`
- **权限**: `user:update`
- **请求体**: 同创建用户（密码可选）

### 2.5 删除用户
- **接口**: `DELETE /users/{user_id}`
- **权限**: `user:delete`

### 2.6 激活/禁用用户
- **接口**: `PATCH /users/{user_id}/status`
- **权限**: `user:update`
- **请求体**:
```json
{
  "is_active": false
}
```

## 3. 角色管理接口

### 3.1 获取角色列表
- **接口**: `GET /roles`
- **权限**: `role:read`
- **参数**:
  - `page`: 页码
  - `size`: 每页数量
  - `keyword`: 搜索关键词

### 3.2 创建角色
- **接口**: `POST /roles`
- **权限**: `role:create`
- **请求体**:
```json
{
  "name": "操作员",
  "description": "负责日常操作",
  "permission_ids": [1, 2, 3]
}
```

### 3.3 获取角色详情
- **接口**: `GET /roles/{role_id}`
- **权限**: `role:read`

### 3.4 更新角色
- **接口**: `PUT /roles/{role_id}`
- **权限**: `role:update`

### 3.5 删除角色
- **接口**: `DELETE /roles/{role_id}`
- **权限**: `role:delete`

### 3.6 获取角色权限
- **接口**: `GET /roles/{role_id}/permissions`
- **权限**: `role:read`

### 3.7 更新角色权限
- **接口**: `PUT /roles/{role_id}/permissions`
- **权限**: `role:update`
- **请求体**:
```json
{
  "permission_ids": [1, 2, 3, 4]
}
```

## 4. 权限管理接口

### 4.1 获取权限列表
- **接口**: `GET /permissions`
- **权限**: `permission:read`
- **参数**:
  - `page`: 页码
  - `size`: 每页数量
  - `resource`: 资源筛选
  - `action`: 操作筛选

### 4.2 创建权限
- **接口**: `POST /permissions`
- **权限**: `permission:create`
- **请求体**:
```json
{
  "name": "交易读取",
  "code": "transaction:read",
  "description": "读取交易信息的权限",
  "resource": "transaction",
  "action": "read"
}
```

### 4.3 获取权限详情
- **接口**: `GET /permissions/{permission_id}`
- **权限**: `permission:read`

### 4.4 更新权限
- **接口**: `PUT /permissions/{permission_id}`
- **权限**: `permission:update`

### 4.5 删除权限
- **接口**: `DELETE /permissions/{permission_id}`
- **权限**: `permission:delete`

## 5. 交易管理接口

### 5.1 获取交易列表
- **接口**: `GET /transactions`
- **权限**: `transaction:read`
- **参数**:
  - `page`: 页码
  - `size`: 每页数量
  - `type`: 交易类型 (buy/sell)
  - `status`: 交易状态
  - `start_date`: 开始日期
  - `end_date`: 结束日期
  - `user_id`: 用户ID筛选

### 5.2 创建交易
- **接口**: `POST /transactions`
- **权限**: `transaction:create`
- **请求体**:
```json
{
  "type": "buy",
  "product_name": "苹果股票",
  "quantity": 100,
  "unit_price": 150.00,
  "notes": "交易备注"
}
```

### 5.3 获取交易详情
- **接口**: `GET /transactions/{transaction_id}`
- **权限**: `transaction:read`

### 5.4 更新交易
- **接口**: `PUT /transactions/{transaction_id}`
- **权限**: `transaction:update`

### 5.5 删除交易
- **接口**: `DELETE /transactions/{transaction_id}`
- **权限**: `transaction:delete`

### 5.6 更新交易状态
- **接口**: `PATCH /transactions/{transaction_id}/status`
- **权限**: `transaction:update`
- **请求体**:
```json
{
  "status": "completed",
  "notes": "状态更新备注"
}
```

### 5.7 获取交易统计
- **接口**: `GET /transactions/statistics`
- **权限**: `transaction:read`
- **参数**:
  - `start_date`: 开始日期
  - `end_date`: 结束日期
  - `user_id`: 用户ID
- **响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total_count": 156,
    "total_amount": 1580000.00,
    "buy_count": 89,
    "sell_count": 67,
    "pending_count": 12,
    "completed_count": 144
  }
}
```

## 6. 菜单管理接口

### 6.1 获取菜单列表
- **接口**: `GET /menus`
- **权限**: `menu:read`
- **描述**: 获取用户可访问的菜单列表（基于权限过滤）

### 6.2 获取所有菜单
- **接口**: `GET /menus/all`
- **权限**: `menu:manage`
- **描述**: 获取所有菜单（用于后台管理）

### 6.3 创建菜单
- **接口**: `POST /menus`
- **权限**: `menu:create`
- **请求体**:
```json
{
  "name": "用户管理",
  "path": "/users",
  "component": "Users",
  "icon": "User",
  "parent_id": null,
  "sort_order": 1,
  "is_visible": true,
  "permission_code": "user:read"
}
```

### 6.4 更新菜单
- **接口**: `PUT /menus/{menu_id}`
- **权限**: `menu:update`

### 6.5 删除菜单
- **接口**: `DELETE /menus/{menu_id}`
- **权限**: `menu:delete`

## 7. 系统管理接口

### 7.1 获取系统配置
- **接口**: `GET /system/config`
- **权限**: `system:read`

### 7.2 更新系统配置
- **接口**: `PUT /system/config`
- **权限**: `system:manage`
- **请求体**:
```json
{
  "site_name": "交易管理系统",
  "site_description": "多角色交易管理系统",
  "max_login_attempts": 5,
  "session_timeout": 3600
}
```

### 7.3 获取系统日志
- **接口**: `GET /system/logs`
- **权限**: `system:read`
- **参数**:
  - `page`: 页码
  - `size`: 每页数量
  - `level`: 日志级别
  - `start_date`: 开始日期
  - `end_date`: 结束日期

### 7.4 获取在线用户
- **接口**: `GET /system/online-users`
- **权限**: `system:read`

## 8. 文件管理接口

### 8.1 上传文件
- **接口**: `POST /files/upload`
- **权限**: `file:upload`
- **请求**: multipart/form-data
- **参数**: `file` (文件)

### 8.2 下载文件
- **接口**: `GET /files/{file_id}/download`
- **权限**: `file:download`

### 8.3 删除文件
- **接口**: `DELETE /files/{file_id}`
- **权限**: `file:delete`

## 权限代码定义

### 用户管理
- `user:read` - 读取用户信息
- `user:create` - 创建用户
- `user:update` - 更新用户信息
- `user:delete` - 删除用户

### 角色管理
- `role:read` - 读取角色信息
- `role:create` - 创建角色
- `role:update` - 更新角色
- `role:delete` - 删除角色

### 权限管理
- `permission:read` - 读取权限信息
- `permission:create` - 创建权限
- `permission:update` - 更新权限
- `permission:delete` - 删除权限

### 交易管理
- `transaction:read` - 读取交易信息
- `transaction:create` - 创建交易
- `transaction:update` - 更新交易
- `transaction:delete` - 删除交易

### 菜单管理
- `menu:read` - 读取菜单
- `menu:create` - 创建菜单
- `menu:update` - 更新菜单
- `menu:delete` - 删除菜单
- `menu:manage` - 菜单管理

### 系统管理
- `system:read` - 读取系统信息
- `system:manage` - 系统管理

### 文件管理
- `file:upload` - 上传文件
- `file:download` - 下载文件
- `file:delete` - 删除文件

## 状态码说明

- `0` - 成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `422` - 数据验证失败
- `500` - 服务器内部错误

## 开发注意事项

1. 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. 权限检查基于用户角色的权限列表进行验证
3. 分页参数 `page` 从1开始，`size` 默认为20，最大不超过100
4. 日期格式统一使用 ISO 8601 格式 (YYYY-MM-DDTHH:mm:ss)
5. 金额字段使用 Decimal 类型，精确到小数点后2位
6. 所有的删除操作建议使用软删除
7. 关键操作需要记录操作日志
8. 文件上传需要限制文件类型和大小
9. 密码需要进行哈希加密存储
10. Token 过期时间建议设置为24小时 
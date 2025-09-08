# 多角色交易管理系统

## 项目简介

这是一个基于 Vue 3 + TypeScript + Element Plus 开发的多角色交易管理系统前端项目。系统支持不同角色用户登录后查看不同的页面和功能，并且支持动态权限配置。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: SCSS
- **图标**: Element Plus Icons
- **代码规范**: ESLint + Stylelint

## 功能特性

### 🔐 认证与授权
- JWT Token 认证
- 基于角色的权限控制 (RBAC)
- 路由级权限保护
- 组件级权限控制
- 权限指令支持

### 👥 用户管理
- 多角色用户系统
- 用户创建、编辑、删除
- 用户状态管理
- 角色分配

### 🔑 权限管理
- 动态权限配置
- 角色权限管理
- 菜单权限控制
- 按钮级权限控制

### 💰 交易管理
- 交易记录管理
- 交易状态跟踪
- 交易统计分析
- 交易类型分类

### 📊 仪表盘
- 数据统计展示
- 权限相关的功能展示
- 快捷操作入口
- 最近交易记录

## 权限系统设计

### 权限代码规范
权限代码采用 `资源:操作` 的格式，例如：
- `user:read` - 读取用户信息
- `user:create` - 创建用户
- `transaction:update` - 更新交易
- `system:manage` - 系统管理

### 预设角色
- **系统管理员** - 拥有所有权限
- **操作员** - 拥有交易管理和部分用户查看权限
- **普通用户** - 只能查看自己的交易记录

## 项目结构

```
src/
├── api/                    # API接口
│   ├── auth.ts            # 认证相关API
│   └── request.ts         # axios封装
├── components/            # 公共组件
├── directives/           # 自定义指令
│   └── permission.ts     # 权限指令
├── layout/               # 布局组件
│   ├── components/       # 布局子组件
│   └── index.vue        # 主布局
├── router/               # 路由配置
│   └── index.ts         # 路由定义
├── stores/               # 状态管理
│   └── auth.ts          # 认证状态
├── styles/               # 样式文件
│   ├── index.scss       # 全局样式
│   └── variables.scss   # SCSS变量
├── types/                # 类型定义
│   └── index.ts         # TypeScript类型
├── utils/                # 工具函数
│   └── permission.ts    # 权限工具
├── views/                # 页面组件
│   ├── Dashboard.vue    # 仪表盘
│   ├── Login.vue        # 登录页
│   ├── error/           # 错误页面
│   ├── transactions/    # 交易管理
│   ├── users/           # 用户管理
│   ├── roles/           # 角色管理
│   ├── permissions/     # 权限管理
│   └── settings/        # 系统设置
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 安装与运行

### 环境要求
- Node.js >= 16
- npm >= 7 或 yarn >= 1.22

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发环境运行
```bash
npm run dev
# 或
yarn dev
```

项目将在 `http://localhost:3000` 启动

### 生产环境构建
```bash
npm run build
# 或
yarn build
```

### 代码检查
```bash
# ESLint检查
npm run lint

# 样式检查
npm run lint:style
```

## 测试账号

### 管理员账号
- 用户名: `admin`
- 密码: `admin123`
- 权限: 所有功能权限

### 操作员账号
- 用户名: `operator`
- 密码: `operator123`
- 权限: 交易管理、用户查看

### 普通用户账号
- 用户名: `user`
- 密码: `user123`
- 权限: 仅查看个人交易

## 权限使用示例

### 在模板中使用权限指令
```vue
<template>
  <!-- 检查单个权限 -->
  <el-button v-permission="'user:create'">创建用户</el-button>
  
  <!-- 检查多个权限（需要全部拥有） -->
  <el-button v-permission="['user:read', 'user:update']">编辑用户</el-button>
  
  <!-- 检查角色 -->
  <div v-role="'admin'">管理员专用功能</div>
  
  <!-- 检查任意权限（拥有其中一个即可） -->
  <div v-permission-any="['user:read', 'role:read']">用户或角色管理</div>
</template>
```

### 在组件中使用权限函数
```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 检查权限
const canCreateUser = authStore.hasPermission('user:create')
const isAdmin = authStore.hasRole('admin')

// 根据权限显示不同内容
const menuItems = computed(() => {
  const items = []
  if (authStore.hasPermission('user:read')) {
    items.push({ name: '用户管理', path: '/users' })
  }
  if (authStore.hasPermission('transaction:read')) {
    items.push({ name: '交易管理', path: '/transactions' })
  }
  return items
})
</script>
```

## API接口说明

后端API接口详细文档请参考 [API接口文档.md](./API接口文档.md)

### 基础配置
- 接口基础地址: `http://localhost:8000`
- 认证方式: Bearer Token
- 响应格式: JSON

### 主要接口模块
- 认证模块: `/auth/*`
- 用户管理: `/users/*`
- 角色管理: `/roles/*`
- 权限管理: `/permissions/*`
- 交易管理: `/transactions/*`
- 系统管理: `/system/*`

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型约束
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 进行代码规范检查
- 使用 Stylelint 进行样式规范检查

### 命名规范
- 组件名使用 PascalCase
- 文件名使用 kebab-case 或 camelCase
- 变量和函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### Git提交规范
```bash
feat: 新增功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 部署说明

### 前端部署
1. 执行构建命令生成 `dist` 目录
2. 将 `dist` 目录下的文件部署到 Web 服务器
3. 配置 Nginx 或 Apache 支持 SPA 路由

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-server:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 后端对接

### FastAPI后端项目
系统需要配合 FastAPI 后端服务使用，后端项目应该包含：

1. **用户认证模块** - JWT token 生成和验证
2. **权限管理模块** - 用户、角色、权限的 CRUD 操作
3. **交易管理模块** - 交易数据的管理和统计
4. **数据库设计** - 用户表、角色表、权限表、交易表等

### 数据库表结构建议
- `users` - 用户表
- `roles` - 角色表
- `permissions` - 权限表
- `role_permissions` - 角色权限关联表
- `user_roles` - 用户角色关联表（可选，如果一个用户只有一个角色可直接在用户表存储）
- `transactions` - 交易表
- `menus` - 菜单表

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。

---

**注意**: 这是一个演示项目，生产环境使用时请确保：
1. 更改默认的测试账号密码
2. 配置正确的后端API地址
3. 添加适当的错误处理和日志记录
4. 进行充分的安全测试 
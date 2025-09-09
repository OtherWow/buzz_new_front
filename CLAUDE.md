# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + TypeScript + Element Plus 的多角色交易管理系统前端项目。系统采用基于角色的权限控制 (RBAC)，支持动态权限配置和多角色用户管理。

## 开发命令

### 启动开发服务器
```bash
npm run dev
```
开发服务器运行在 http://localhost:3000，支持热重载和代理到后端API (http://localhost:8000)

### 构建项目
```bash
npm run build
```
构建前会自动运行 TypeScript 类型检查 (vue-tsc)

### 代码规范检查
```bash
# JavaScript/TypeScript/Vue 文件的ESLint检查和自动修复
npm run lint

# CSS/SCSS/Vue文件的样式检查和自动修复
npm run lint:style
```

### 预览生产构建
```bash
npm run preview
```

## 核心架构

### 权限系统架构
- **权限代码格式**: `资源:操作` (如 `user:read`, `transaction:create`)
- **路由权限**: 在路由meta中定义 `permission` 字段进行权限控制
- **权限指令**: 支持 `v-permission`、`v-role`、`v-permission-any` 指令
- **权限守卫**: 路由守卫自动检查用户权限和登录状态

### 状态管理 (Pinia)
- **认证状态** (`stores/auth.ts`): 管理用户登录、token、权限等状态
- **页签状态** (`stores/tabs.ts`): 管理页面标签页的动态添加和切换

### API架构
- **统一请求封装** (`api/request.ts`): 基于axios的请求拦截器，自动添加认证token
- **API代理配置**: 开发环境下 `/api` 请求代理到 `http://localhost:8000`
- **认证API** (`api/auth.ts`): 处理登录、权限验证等认证相关接口

### 路由系统
- **权限路由**: 路由配置包含权限要求 (`meta.permission`)
- **动态导航**: 根据用户权限动态显示菜单项
- **路由守卫**: 自动处理认证检查和权限验证
- **页签管理**: 自动管理已访问页面的标签页

## 关键组件和文件

### 布局系统
- `layout/index.vue`: 主布局容器
- `layout/components/Header.vue`: 顶部导航和用户信息
- `layout/components/RoleSwitcher.vue`: 角色切换组件

### 权限控制
- `directives/permission.ts`: 权限指令定义
- `utils/permission.ts`: 权限工具函数
- `stores/auth.ts:14-20`: 权限和角色计算属性

### 路径别名配置
- `@/*` 映射到 `src/*` 目录
- 在 `vite.config.ts:10` 和 `tsconfig.json:25-27` 中定义

## 开发规范

### TypeScript配置
- 启用严格模式检查
- 路径映射支持 `@/*` 别名
- 包含 Node.js 类型定义

### 代码风格
- ESLint + TypeScript 规则检查
- Stylelint 样式规范检查
- Vue 3 Composition API 优先

### 权限使用示例
```vue
<!-- 模板中的权限指令 -->
<el-button v-permission="'user:create'">创建用户</el-button>
<div v-role="'admin'">管理员功能</div>

<!-- 组件中的权限检查 -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const canEdit = authStore.hasPermission('user:update')
</script>
```

## 测试账号
- 管理员: `admin` / `admin123` (所有权限)
- 操作员: `operator` / `operator123` (交易管理权限)
- 普通用户: `user` / `user123` (仅查看个人交易)

## 后端集成
系统需要配合FastAPI后端服务，API基础地址为 `http://localhost:8000`，使用JWT Bearer token认证。
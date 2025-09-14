import request from './request'
import type { ApiResponse } from '@/types'

// ================================
// RBAC 权限管理 API 接口
// 基于 RBAC_API_文档.md 规范
// ================================

// 角色相关接口
export interface RoleCreateRequest {
  role_name: string          // 必填，最大10字符
  desc?: string             // 可选，最大60字符
}

export interface RoleUpdateRequest {
  role_name?: string        // 可选
  desc?: string            // 可选
  status?: number          // 可选，1启用/0禁用
}

export interface Role {
  id: number
  role_name: string
  desc: string
  status: number
  created: string
  modified: string
}

export interface RoleListResponse {
  total: number
  items: Role[]
}

// 菜单相关接口
export interface MenuCreateRequest {
  name: string              // 必填，菜单名称
  icon?: string            // 可选，图标
  path?: string            // 可选，路径
  type: number             // 必填，类型 1菜单/2按钮/3接口
  component?: string       // 可选，前端组件
  pid?: number             // 可选，父菜单ID
  identifier?: string      // 可选，权限标识符
  api?: string             // 可选，接口地址
  method?: string          // 可选，HTTP方法
}

export interface Menu {
  id: number
  name: string
  icon?: string
  path?: string
  type: number
  component?: string
  pid: number
  identifier?: string
  api?: string
  method?: string
  children?: Menu[]
}

// 用户权限信息
export interface UserPermissions {
  user_id: number
  username: string
  roles: Role[]
  permissions: Menu[]
  menu_tree: Menu[]
}

// 权限检查
export interface PermissionCheckResponse {
  has_permission: boolean
  permission_identifier: string
  message: string
}

export interface ApiPermissionCheckRequest {
  api_path: string
  method: string
}

// 用户角色分配
export interface UserRoleAssignRequest {
  user_id: number
  role_ids: number[]
}

// 角色权限分配
export interface RolePermissionAssignRequest {
  role_id: number
  menu_ids: number[]
}

// ================================
// API 接口方法
// ================================

export const rbacApi = {
  // ==================== 角色管理 ====================
  
  /**
   * 创建角色
   * @param data 角色数据
   */
  createRole: (data: RoleCreateRequest) => {
    return request.post<ApiResponse<Role>>('/rbac/roles', data)
  },

  /**
   * 获取角色列表
   * @param page 页码 (默认1)
   * @param size 每页数量 (默认20，最大100)
   * @param name 角色名称筛选 (可选)
   * @param status 状态筛选 (可选，1启用/0禁用)
   */
  getRoles: (page = 1, size = 20, name?: string, status?: number) => {
    const params: any = { page, size }
    if (name) params.name = name
    if (status !== undefined) params.status = status
    
    return request.get<ApiResponse<RoleListResponse>>('/rbac/roles', { params })
  },

  /**
   * 获取角色详情
   * @param roleId 角色ID
   */
  getRole: (roleId: number) => {
    return request.get<ApiResponse<Role>>(`/rbac/roles/${roleId}`)
  },

  /**
   * 更新角色
   * @param roleId 角色ID
   * @param data 更新数据
   */
  updateRole: (roleId: number, data: RoleUpdateRequest) => {
    return request.put<ApiResponse<Role>>(`/rbac/roles/${roleId}`, data)
  },

  /**
   * 删除角色
   * @param roleId 角色ID
   */
  deleteRole: (roleId: number) => {
    return request.delete<ApiResponse<boolean>>(`/rbac/roles/${roleId}`)
  },

  // ==================== 菜单权限管理 ====================

  /**
   * 创建菜单
   * @param data 菜单数据
   */
  createMenu: (data: MenuCreateRequest) => {
    return request.post<ApiResponse<Menu>>('/rbac/menus', data)
  },

  /**
   * 获取菜单列表
   * @param page 页码
   * @param size 每页数量
   * @param name 菜单名称筛选
   * @param type 菜单类型筛选
   * @param status 状态筛选
   */
  getMenus: (page = 1, size = 20, name?: string, type?: number, status?: number) => {
    const params: any = { page, size }
    if (name) params.name = name
    if (type !== undefined) params.type = type
    if (status !== undefined) params.status = status
    
    return request.get<ApiResponse<{ total: number; items: Menu[] }>>('/rbac/menus', { params })
  },

  /**
   * 获取菜单树结构
   */
  getMenuTree: () => {
    return request.get<ApiResponse<Menu[]>>('/rbac/menus/tree')
  },

  /**
   * 更新菜单
   * @param menuId 菜单ID
   * @param data 更新数据
   */
  updateMenu: (menuId: number, data: Partial<MenuCreateRequest>) => {
    return request.put<ApiResponse<Menu>>(`/rbac/menus/${menuId}`, data)
  },

  /**
   * 删除菜单
   * @param menuId 菜单ID
   */
  deleteMenu: (menuId: number) => {
    return request.delete<ApiResponse<boolean>>(`/rbac/menus/${menuId}`)
  },

  // ==================== 用户角色管理 ====================

  /**
   * 分配用户角色
   * @param data 用户角色分配数据
   */
  assignUserRoles: (data: UserRoleAssignRequest) => {
    return request.post<ApiResponse<boolean>>('/rbac/user-roles', data)
  },

  /**
   * 获取用户角色
   * @param userId 用户ID
   */
  getUserRoles: (userId: number) => {
    return request.get<ApiResponse<Role[]>>(`/rbac/users/${userId}/roles`)
  },

  // ==================== 角色权限管理 ====================

  /**
   * 分配角色权限
   * @param data 角色权限分配数据
   */
  assignRolePermissions: (data: RolePermissionAssignRequest) => {
    return request.post<ApiResponse<boolean>>('/rbac/role-permissions', data)
  },

  /**
   * 获取角色权限
   * @param roleId 角色ID
   */
  getRolePermissions: (roleId: number) => {
    return request.get<ApiResponse<Menu[]>>(`/rbac/roles/${roleId}/permissions`)
  },

  // ==================== 用户权限查询 ====================

  /**
   * 获取用户权限信息
   * @param userId 用户ID
   */
  getUserPermissions: (userId: number) => {
    return request.get<ApiResponse<UserPermissions>>(`/rbac/users/${userId}/permissions`)
  },

  /**
   * 获取当前用户权限
   */
  getMyPermissions: () => {
    return request.get<ApiResponse<UserPermissions>>('/rbac/my-permissions')
  },

  /**
   * 检查权限
   * @param permissionIdentifier 权限标识符
   */
  checkPermission: (permissionIdentifier: string) => {
    return request.get<ApiResponse<PermissionCheckResponse>>(`/rbac/check-permission/${permissionIdentifier}`)
  },

  /**
   * 检查API权限
   * @param data API权限检查数据
   */
  checkApiPermission: (data: ApiPermissionCheckRequest) => {
    return request.post<ApiResponse<PermissionCheckResponse>>('/rbac/check-api-permission', data)
  },

  // ==================== 缓存管理 ====================

  /**
   * 清除所有权限缓存
   * 需要"超级管理员"角色
   */
  clearAllCache: () => {
    return request.post<ApiResponse<boolean>>('/rbac/clear-cache')
  },

  /**
   * 清除用户权限缓存
   * @param userId 用户ID
   */
  clearUserCache: (userId: number) => {
    return request.post<ApiResponse<boolean>>(`/rbac/clear-user-cache/${userId}`)
  }
}

// 导出类型 (使用type关键字避免冲突)
export type {
  Role as RBACRole,
  Menu as RBACMenu,
  UserPermissions as RBACUserPermissions,
  PermissionCheckResponse as RBACPermissionCheckResponse,
  RoleCreateRequest as RBACRoleCreateRequest,
  RoleUpdateRequest as RBACRoleUpdateRequest,
  MenuCreateRequest as RBACMenuCreateRequest,
  UserRoleAssignRequest as RBACUserRoleAssignRequest,
  RolePermissionAssignRequest as RBACRolePermissionAssignRequest,
  ApiPermissionCheckRequest as RBACApiPermissionCheckRequest
}

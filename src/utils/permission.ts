import { useAuthStore } from '@/stores/auth'
import { rbacApi } from '@/api/rbac'

/**
 * 检查用户是否拥有指定权限
 * @param permission 权限代码
 * @returns boolean
 */
export function hasPermission(permission: string): boolean {
  const authStore = useAuthStore()
  return authStore.hasPermission(permission)
}

/**
 * 检查用户是否拥有指定角色
 * @param role 角色名称
 * @returns boolean
 */
export function hasRole(role: string): boolean {
  const authStore = useAuthStore()
  return authStore.hasRole(role)
}

/**
 * 检查用户是否拥有任意一个权限
 * @param permissions 权限代码数组
 * @returns boolean
 */
export function hasAnyPermission(permissions: string[]): boolean {
  const authStore = useAuthStore()
  return permissions.some(permission => authStore.hasPermission(permission))
}

/**
 * 检查用户是否拥有所有权限
 * @param permissions 权限代码数组
 * @returns boolean
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const authStore = useAuthStore()
  return permissions.every(permission => authStore.hasPermission(permission))
}

/**
 * 获取用户权限列表
 * @returns string[]
 */
export function getUserPermissions(): string[] {
  const authStore = useAuthStore()
  return authStore.userPermissions
}

/**
 * 获取用户角色
 * @returns string
 */
export function getUserRole(): string {
  const authStore = useAuthStore()
  return authStore.userRole
}

/**
 * 使用RBAC API在线检查权限
 * @param permissionIdentifier 权限标识符
 * @returns Promise<boolean>
 */
export async function checkPermissionOnline(permissionIdentifier: string): Promise<boolean> {
  try {
    const response = await rbacApi.checkPermission(permissionIdentifier)
    return response.data.has_permission
  } catch (error) {
    console.error('在线权限检查失败:', error)
    return false
  }
}

/**
 * 使用RBAC API检查API权限
 * @param apiPath API路径
 * @param method HTTP方法
 * @returns Promise<boolean>
 */
export async function checkApiPermissionOnline(apiPath: string, method: string): Promise<boolean> {
  try {
    const response = await rbacApi.checkApiPermission({ api_path: apiPath, method })
    return response.data.has_permission
  } catch (error) {
    console.error('在线API权限检查失败:', error)
    return false
  }
} 
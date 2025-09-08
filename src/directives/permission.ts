import type { App, DirectiveBinding } from 'vue'
import { hasPermission, hasRole, hasAnyPermission } from '@/utils/permission'

/**
 * 权限指令
 * v-permission="'user:read'" - 检查单个权限
 * v-permission="['user:read', 'user:write']" - 检查多个权限（需要全部拥有）
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value) return
    
    let hasAuth = false
    
    if (Array.isArray(value)) {
      // 检查是否拥有所有权限
      hasAuth = value.every(permission => hasPermission(permission))
    } else {
      // 检查单个权限
      hasAuth = hasPermission(value)
    }
    
    if (!hasAuth) {
      el.style.display = 'none'
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value) return
    
    let hasAuth = false
    
    if (Array.isArray(value)) {
      hasAuth = value.every(permission => hasPermission(permission))
    } else {
      hasAuth = hasPermission(value)
    }
    
    if (!hasAuth) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

/**
 * 角色指令
 * v-role="'admin'" - 检查单个角色
 * v-role="['admin', 'manager']" - 检查多个角色（拥有任意一个即可）
 */
export const roleDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value) return
    
    let hasAuth = false
    
    if (Array.isArray(value)) {
      // 检查是否拥有任意一个角色
      hasAuth = value.some(role => hasRole(role))
    } else {
      // 检查单个角色
      hasAuth = hasRole(value)
    }
    
    if (!hasAuth) {
      el.style.display = 'none'
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value) return
    
    let hasAuth = false
    
    if (Array.isArray(value)) {
      hasAuth = value.some(role => hasRole(role))
    } else {
      hasAuth = hasRole(value)
    }
    
    if (!hasAuth) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

/**
 * 权限指令（或逻辑）
 * v-permission-any="['user:read', 'user:write']" - 拥有任意一个权限即可显示
 */
export const permissionAnyDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value || !Array.isArray(value)) return
    
    const hasAuth = hasAnyPermission(value)
    
    if (!hasAuth) {
      el.style.display = 'none'
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    
    if (!value || !Array.isArray(value)) return
    
    const hasAuth = hasAnyPermission(value)
    
    if (!hasAuth) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

// 注册权限指令
export function setupPermissionDirectives(app: App) {
  app.directive('permission', permissionDirective)
  app.directive('role', roleDirective)
  app.directive('permission-any', permissionAnyDirective)
} 
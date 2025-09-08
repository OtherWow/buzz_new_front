import request from './request'
import { mockLogin, mockGetCurrentUser, mockSwitchRole, mockGetAvailableRoles } from './mock'
import type { LoginForm, LoginResponse, User, ApiResponse, Role } from '@/types'

// 检查是否在开发环境或没有后端服务
const isDev = import.meta.env.DEV
const useMock = true // 暂时使用模拟数据，等后端服务启动后可以改为 false

export const authApi = {
  // 用户登录
  login: async (data: LoginForm) => {
    if (useMock || isDev) {
      return await mockLogin(data)
    }
    return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    if (useMock || isDev) {
      return await mockGetCurrentUser()
    }
    return request.get<ApiResponse<User>>('/auth/me')
  },

  // 切换角色
  switchRole: async (roleId: number) => {
    if (useMock || isDev) {
      return await mockSwitchRole(roleId)
    }
    return request.post<ApiResponse<User>>('/auth/switch-role', { role_id: roleId })
  },

  // 获取可切换的角色列表
  getAvailableRoles: async () => {
    if (useMock || isDev) {
      return await mockGetAvailableRoles()
    }
    return request.get<ApiResponse<Role[]>>('/auth/available-roles')
  },

  // 刷新token
  refreshToken: () => {
    return request.post<ApiResponse<{ access_token: string }>>('/auth/refresh')
  },

  // 修改密码
  changePassword: (data: { old_password: string; new_password: string }) => {
    return request.post<ApiResponse<void>>('/auth/change-password', data)
  },

  // 用户注销
  logout: () => {
    return request.post<ApiResponse<void>>('/auth/logout')
  }
} 
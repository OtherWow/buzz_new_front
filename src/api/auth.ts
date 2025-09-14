import request from './request'
import type { LoginForm, LoginResponse, User, ApiResponse, Role } from '@/types'
import { rbacApi } from './rbac'

// JWT Token 登录接口
export interface JWTLoginRequest {
  username: string
  password: string
}

export interface JWTLoginResponse {
  access_token: string
  token_type: string
}

export const authApi = {
  // JWT Token 登录 (对接后端 /token 接口)
  jwtLogin: async (data: JWTLoginRequest) => {
    // 使用 application/x-www-form-urlencoded 格式，符合 FastAPI OAuth2 标准
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)

    try {
      const response = await request.post<any>('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      // 后端返回格式是 {encrypted_data: "..."}, 需要处理
      if (response.data.encrypted_data) {
        // 暂时使用encrypted_data作为token，实际项目中需要解密
        return {
          data: {
            access_token: response.data.encrypted_data,
            token_type: 'Bearer'
          }
        }
      } else {
        throw new Error('登录响应格式错误')
      }
    } catch (error: any) {
      // 如果是axios错误，抛出更详细的信息
      if (error.response?.status === 401) {
        throw new Error('用户名或密码错误')
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail)
      } else {
        throw new Error(error.message || '登录失败')
      }
    }
  },

  // 用户登录
  login: async (data: LoginForm) => {
    try {
      // 使用JWT登录
      const jwtResponse = await authApi.jwtLogin(data)

      // 尝试获取用户权限信息
      let userData = null
      try {
        const userPermissions = await rbacApi.getMyPermissions()
        userData = userPermissions.data
      } catch (rbacError) {
        console.warn('无法获取RBAC权限信息，使用基本用户信息:', rbacError)
        // 如果RBAC API失败，创建基本用户信息
        userData = {
          user_id: 1,
          username: data.username,
          roles: [{ id: 1, role_name: 'user', description: '普通用户' }],
          permissions: []
        }
      }

      // 转换为前端期望的格式
      const loginResponse: LoginResponse = {
        access_token: jwtResponse.data.access_token,
        user: {
          id: userData.user_id,
          username: userData.username,
          roles: userData.roles || [],
          permissions: userData.permissions || [],
          currentRole: userData.roles?.[0] || { id: 1, role_name: 'user', description: '普通用户' },
          avatar: '',
          email: '',
          phone: '',
          status: 1,
          created_at: '',
          updated_at: ''
        }
      }

      return { data: loginResponse }
    } catch (error: any) {
      throw error
    }
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const userPermissions = await rbacApi.getMyPermissions()
    const userData = userPermissions.data

    const user: User = {
      id: userData.user_id,
      username: userData.username,
      roles: userData.roles,
      permissions: userData.permissions,
      currentRole: userData.roles[0],
      avatar: '',
      email: '',
      phone: '',
      status: 1,
      created_at: '',
      updated_at: ''
    }

    return { data: user }
  },

  // 切换角色 - 在RBAC系统中，只是改变当前活跃角色，不需要后端API
  switchRole: async (roleId: number) => {
    // 获取当前用户信息
    const userResponse = await authApi.getCurrentUser()
    const user = userResponse.data

    // 找到要切换到的角色
    const targetRole = user.roles.find(role => role.id === roleId)
    if (!targetRole) {
      throw new Error('角色不存在或无权限')
    }

    // 更新当前角色
    const updatedUser: User = {
      ...user,
      currentRole: targetRole
    }

    return { data: updatedUser }
  },

  // 获取可切换的角色列表 - 返回当前用户的所有角色
  getAvailableRoles: async () => {
    const userResponse = await authApi.getCurrentUser()
    return { data: userResponse.data.roles }
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
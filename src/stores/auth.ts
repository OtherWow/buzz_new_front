import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm, LoginResponse } from '@/types'
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>('')
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 用户权限
  const userPermissions = computed(() => {
    if (!user.value?.role?.permissions) return []
    return user.value.role.permissions.map(p => p.code)
  })

  // 用户角色
  const userRole = computed(() => user.value?.role?.name || '')

  // 登录
  const login = async (loginForm: LoginForm): Promise<boolean> => {
    try {
      const response = await authApi.login(loginForm)
      const loginData = response.data
      
      token.value = loginData.access_token
      user.value = loginData.user
      
      // 保存到本地存储
      localStorage.setItem('token', loginData.access_token)
      localStorage.setItem('user', JSON.stringify(loginData.user))
      
      ElMessage.success('登录成功')
      return true
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
      return false
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.success('已退出登录')
  }

  // 检查权限
  const hasPermission = (permissionCode: string): boolean => {
    return userPermissions.value.includes(permissionCode)
  }

  // 检查角色
  const hasRole = (roleName: string): boolean => {
    return userRole.value === roleName
  }

  // 初始化认证状态
  const initAuth = async () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // 不需要重新获取用户信息，因为角色切换已经保存在本地
      // 这样可以保持用户切换后的角色状态
    }
  }

  // 更新用户信息
  const updateUser = (userData: User) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 切换角色
  const switchRole = async (roleId: number): Promise<boolean> => {
    try {
      const response = await authApi.switchRole(roleId)
      const updatedUser = response.data
      
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      ElMessage.success('角色切换成功')
      return true
    } catch (error: any) {
      ElMessage.error(error.message || '角色切换失败')
      return false
    }
  }

  // 获取可切换的角色列表
  const getAvailableRoles = async () => {
    try {
      const response = await authApi.getAvailableRoles()
      return response.data
    } catch (error: any) {
      ElMessage.error(error.message || '获取角色列表失败')
      return []
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    userPermissions,
    userRole,
    login,
    logout,
    hasPermission,
    hasRole,
    initAuth,
    updateUser,
    switchRole,
    getAvailableRoles
  }
}) 
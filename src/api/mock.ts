import type { LoginForm, LoginResponse, User, ApiResponse, Role } from '@/types'

// 所有可用角色
const mockRoles: Role[] = [
  {
    id: 1,
    name: '系统管理员',
    description: '拥有所有权限',
    permissions: [
      { id: 1, name: '用户读取', code: 'user:read', resource: 'user', action: 'read', created_at: '', updated_at: '' },
      { id: 2, name: '用户创建', code: 'user:create', resource: 'user', action: 'create', created_at: '', updated_at: '' },
      { id: 3, name: '用户更新', code: 'user:update', resource: 'user', action: 'update', created_at: '', updated_at: '' },
      { id: 4, name: '用户删除', code: 'user:delete', resource: 'user', action: 'delete', created_at: '', updated_at: '' },
      { id: 5, name: '角色读取', code: 'role:read', resource: 'role', action: 'read', created_at: '', updated_at: '' },
      { id: 6, name: '角色创建', code: 'role:create', resource: 'role', action: 'create', created_at: '', updated_at: '' },
      { id: 7, name: '角色更新', code: 'role:update', resource: 'role', action: 'update', created_at: '', updated_at: '' },
      { id: 8, name: '角色删除', code: 'role:delete', resource: 'role', action: 'delete', created_at: '', updated_at: '' },
      { id: 9, name: '权限读取', code: 'permission:read', resource: 'permission', action: 'read', created_at: '', updated_at: '' },
      { id: 10, name: '权限创建', code: 'permission:create', resource: 'permission', action: 'create', created_at: '', updated_at: '' },
      { id: 11, name: '权限更新', code: 'permission:update', resource: 'permission', action: 'update', created_at: '', updated_at: '' },
      { id: 12, name: '权限删除', code: 'permission:delete', resource: 'permission', action: 'delete', created_at: '', updated_at: '' },
      { id: 13, name: '交易读取', code: 'transaction:read', resource: 'transaction', action: 'read', created_at: '', updated_at: '' },
      { id: 14, name: '交易创建', code: 'transaction:create', resource: 'transaction', action: 'create', created_at: '', updated_at: '' },
      { id: 15, name: '交易更新', code: 'transaction:update', resource: 'transaction', action: 'update', created_at: '', updated_at: '' },
      { id: 16, name: '交易删除', code: 'transaction:delete', resource: 'transaction', action: 'delete', created_at: '', updated_at: '' },
      { id: 17, name: '系统管理', code: 'system:manage', resource: 'system', action: 'manage', created_at: '', updated_at: '' }
    ],
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    name: '操作员',
    description: '负责日常操作',
    permissions: [
      { id: 1, name: '用户读取', code: 'user:read', resource: 'user', action: 'read', created_at: '', updated_at: '' },
      { id: 13, name: '交易读取', code: 'transaction:read', resource: 'transaction', action: 'read', created_at: '', updated_at: '' },
      { id: 14, name: '交易创建', code: 'transaction:create', resource: 'transaction', action: 'create', created_at: '', updated_at: '' },
      { id: 15, name: '交易更新', code: 'transaction:update', resource: 'transaction', action: 'update', created_at: '', updated_at: '' }
    ],
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  },
  {
    id: 3,
    name: '普通用户',
    description: '只能查看自己的交易',
    permissions: [
      { id: 13, name: '交易读取', code: 'transaction:read', resource: 'transaction', action: 'read', created_at: '', updated_at: '' }
    ],
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  },
  {
    id: 4,
    name: '财务专员',
    description: '负责财务相关操作',
    permissions: [
      { id: 13, name: '交易读取', code: 'transaction:read', resource: 'transaction', action: 'read', created_at: '', updated_at: '' },
      { id: 14, name: '交易创建', code: 'transaction:create', resource: 'transaction', action: 'create', created_at: '', updated_at: '' },
      { id: 15, name: '交易更新', code: 'transaction:update', resource: 'transaction', action: 'update', created_at: '', updated_at: '' },
      { id: 1, name: '用户读取', code: 'user:read', resource: 'user', action: 'read', created_at: '', updated_at: '' }
    ],
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  }
]

// 模拟用户数据 - 添加可切换角色信息
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    real_name: '系统管理员',
    is_active: true,
    role_id: 1,
    role: mockRoles[0], // 系统管理员
    available_roles: mockRoles, // 管理员可以切换到任何角色
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    username: 'operator',
    email: 'operator@example.com',
    real_name: '操作员',
    is_active: true,
    role_id: 2,
    role: mockRoles[1], // 操作员
    available_roles: [mockRoles[1], mockRoles[2]], // 可以切换到操作员和普通用户
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  },
  {
    id: 3,
    username: 'user',
    email: 'user@example.com',
    real_name: '普通用户',
    is_active: true,
    role_id: 3,
    role: mockRoles[2], // 普通用户
    available_roles: [mockRoles[2]], // 只能是普通用户
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00'
  }
]

// 模拟登录
export const mockLogin = async (loginForm: LoginForm): Promise<ApiResponse<LoginResponse>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const user = mockUsers.find(u => u.username === loginForm.username)
  
  if (!user) {
    throw new Error('用户不存在')
  }
  
  // 简单的密码验证
  const passwordMap: Record<string, string> = {
    'admin': 'admin123',
    'operator': 'operator123',
    'user': 'user123'
  }
  
  if (passwordMap[loginForm.username] !== loginForm.password) {
    throw new Error('密码错误')
  }
  
  const token = `mock_token_${user.id}_${Date.now()}`
  
  return {
    code: 0,
    message: '登录成功',
    data: {
      access_token: token,
      token_type: 'bearer',
      user
    }
  }
}

// 模拟获取当前用户
export const mockGetCurrentUser = async (): Promise<ApiResponse<User>> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 从 localStorage 获取用户信息
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    throw new Error('未登录')
  }
  
  const user = JSON.parse(userStr)
  
  return {
    code: 0,
    message: 'success',
    data: user
  }
}

// 模拟切换角色
export const mockSwitchRole = async (roleId: number): Promise<ApiResponse<User>> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    throw new Error('未登录')
  }
  
  const user = JSON.parse(userStr) as User
  const targetRole = mockRoles.find(r => r.id === roleId)
  
  if (!targetRole) {
    throw new Error('角色不存在')
  }
  
  // 检查用户是否有权限切换到目标角色
  const canSwitch = user.available_roles?.some(r => r.id === roleId)
  if (!canSwitch) {
    throw new Error('无权限切换到该角色')
  }
  
  // 更新用户角色
  const updatedUser = {
    ...user,
    role_id: roleId,
    role: targetRole
  }
  
  // 保存到本地存储
  localStorage.setItem('user', JSON.stringify(updatedUser))
  
  return {
    code: 0,
    message: '角色切换成功',
    data: updatedUser
  }
}

// 模拟获取用户可切换的角色列表
export const mockGetAvailableRoles = async (): Promise<ApiResponse<Role[]>> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    throw new Error('未登录')
  }
  
  const user = JSON.parse(userStr) as User
  
  return {
    code: 0,
    message: 'success',
    data: user.available_roles || []
  }
}

// 检查是否使用模拟数据
export const shouldUseMock = () => {
  return true // 暂时总是使用模拟数据
} 
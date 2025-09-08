// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  real_name?: string
  avatar?: string
  is_active: boolean
  role_id: number
  role?: Role
  available_roles?: Role[] // 用户可切换的角色列表
  created_at: string
  updated_at: string
}

// 角色相关类型
export interface Role {
  id: number
  name: string
  description?: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

// 权限相关类型
export interface Permission {
  id: number
  name: string
  code: string
  description?: string
  resource: string
  action: string
  created_at: string
  updated_at: string
}

// 菜单相关类型
export interface Menu {
  id: number
  name: string
  path: string
  component?: string
  icon?: string
  parent_id?: number
  sort_order: number
  is_visible: boolean
  permission_code?: string
  children?: Menu[]
}

// 交易相关类型
export interface Transaction {
  id: number
  transaction_no: string
  type: 'buy' | 'sell'
  product_name: string
  quantity: number
  unit_price: number
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled' | 'failed'
  user_id: number
  user?: User
  created_at: string
  updated_at: string
  notes?: string
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// 登录相关类型
export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// 路由元信息类型
export interface RouteMeta {
  title?: string
  permission?: string
  requiresAuth?: boolean
  roles?: string[]
  icon?: string
  hidden?: boolean
} 
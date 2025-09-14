import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置NProgress
NProgress.configure({ showSpinner: false })

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
          icon: 'Dashboard'
        }
      },
      // 交易管理
      {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('@/views/transactions/index.vue'),
        meta: {
          title: '交易管理',
          requiresAuth: true,
          permission: 'transaction:read',
          icon: 'Money'
        }
      },
      {
        path: '/transactions/create',
        name: 'CreateTransaction',
        component: () => import('@/views/transactions/create.vue'),
        meta: {
          title: '创建交易',
          requiresAuth: true,
          permission: 'transaction:create',
          hidden: true
        }
      },
      {
        path: '/transactions/:id',
        name: 'TransactionDetail',
        component: () => import('@/views/transactions/detail.vue'),
        meta: {
          title: '交易详情',
          requiresAuth: true,
          permission: 'transaction:read',
          hidden: true
        }
      },
      // 用户管理
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/users/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          permission: 'user:read',
          icon: 'User'
        }
      },
      // 角色管理
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/roles/index.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true,
          permission: 'role:read',
          icon: 'UserFilled'
        }
      },
      // 权限管理
      {
        path: '/permissions',
        name: 'Permissions',
        component: () => import('@/views/permissions/index.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true,
          permission: 'permission:read',
          icon: 'Lock'
        }
      },
      // 个人设置
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '个人设置',
          requiresAuth: true,
          icon: 'User'
        }
      },
      // 系统设置
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: {
          title: '系统设置',
          requiresAuth: true,
          permission: 'system:manage',
          icon: 'Setting'
        }
      },
      // API测试页面
      {
        path: '/test-api',
        name: 'TestAPI',
        component: () => import('@/views/test-api.vue'),
        meta: {
          title: 'API测试',
          requiresAuth: true,
          icon: 'Connection',
          hidden: true // 隐藏在菜单中
        }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const authStore = useAuthStore()

  // 确保认证状态已初始化
  await authStore.initAuth()

  // 如果需要认证但未登录，跳转到登录页
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 已登录用户访问登录页，跳转到首页
  if (to.name === 'Login' && authStore.isLoggedIn) {
    next('/')
    return
  }
  
  // 检查权限
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    next('/403')
    return
  }
  
  next()
})

router.afterEach(async (to, from) => {
  NProgress.done()
  
  // 页签管理：在路由完成后添加页签
  if (to.meta.requiresAuth !== false && to.name !== 'Login' && !to.path.includes('/error/')) {
    const { useTabsStore } = await import('@/stores/tabs')
    const tabsStore = useTabsStore()
    // 处理重定向情况，使用实际到达的路由
    const actualRoute = to.redirectedFrom ? to : to
    tabsStore.addTab(actualRoute)
  }
})

export default router 
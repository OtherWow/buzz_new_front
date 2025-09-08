<template>
  <div class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :router="true"
      background-color="#1e2329"
      text-color="#b7bdc6"
      active-text-color="#f0b90b"
    >
      <template v-for="item in menuRoutes" :key="item.path">
        <el-menu-item
          :index="item.path"
          :class="{ 'is-active': activeMenu === item.path }"
        >
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

// 获取菜单路由
const menuRoutes = computed(() => {
  // 直接定义菜单项，而不是从路由中过滤
  const menuItems = [
    {
      path: '/dashboard',
      meta: {
        title: '仪表盘',
        icon: 'Dashboard',
        permission: null
      }
    },
    {
      path: '/transactions',
      meta: {
        title: '交易管理',
        icon: 'Money',
        permission: 'transaction:read'
      }
    },
    {
      path: '/users',
      meta: {
        title: '用户管理',
        icon: 'User',
        permission: 'user:read'
      }
    },
    {
      path: '/roles',
      meta: {
        title: '角色管理',
        icon: 'UserFilled',
        permission: 'role:read'
      }
    },
    {
      path: '/permissions',
      meta: {
        title: '权限管理',
        icon: 'Lock',
        permission: 'permission:read'
      }
    },
    {
      path: '/settings',
      meta: {
        title: '系统设置',
        icon: 'Setting',
        permission: 'system:manage'
      }
    }
  ]
  
  // 根据权限过滤菜单项
  return menuItems.filter(item => {
    return !item.meta.permission || hasPermission(item.meta.permission)
  })
})

// 检查权限
const hasPermission = (permission?: string) => {
  if (!permission) return true
  return authStore.hasPermission(permission)
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 54px;
    line-height: 54px;
    color: #b7bdc6;
    margin: 2px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(240, 185, 11, 0.1) !important;
      color: #f0b90b !important;
    }
    
    &.is-active {
      background-color: #f0b90b !important;
      color: #0b0e11 !important;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(240, 185, 11, 0.3);
    }
    
    .el-icon {
      margin-right: 12px;
      color: inherit;
      font-size: 18px;
    }
    
    span {
      color: inherit;
      font-size: 14px;
    }
  }
}
</style> 
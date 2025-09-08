<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/" class="custom-breadcrumb">
      <el-breadcrumb-item 
        v-for="(item, index) in breadcrumbList" 
        :key="item.path"
        :class="{ 'is-current': index === breadcrumbList.length - 1 }"
      >
        <template v-if="index === breadcrumbList.length - 1">
          <!-- 当前页面不可点击 -->
          <el-icon v-if="item.icon" class="breadcrumb-icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <template v-else>
          <!-- 可点击的面包屑项 -->
          <span class="breadcrumb-link" @click="handleBreadcrumbClick(item.path)">
            <el-icon v-if="item.icon" class="breadcrumb-icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </span>
        </template>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  House, 
  TrendCharts, 
  User, 
  UserFilled, 
  Lock, 
  Setting,
  Plus,
  Document
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 处理面包屑点击
const handleBreadcrumbClick = (path: string) => {
  router.push(path)
}

// 路由图标映射
const routeIconMap: Record<string, any> = {
  '/': House,
  '/dashboard': House,
  '/transactions': TrendCharts,
  '/transactions/create': Plus,
  '/transactions/detail': Document,
  '/users': User,
  '/roles': UserFilled,
  '/permissions': Lock,
  '/profile': User,
  '/settings': Setting
}

// 路由标题映射
const routeTitleMap: Record<string, string> = {
  '/': '首页',
  '/dashboard': '仪表盘',
  '/transactions': '交易管理',
  '/transactions/create': '创建交易',
  '/transactions/detail': '交易详情',
  '/users': '用户管理',
  '/roles': '角色管理', 
  '/permissions': '权限管理',
  '/profile': '个人设置',
  '/settings': '系统设置'
}

// 生成面包屑列表
const breadcrumbList = computed(() => {
  const pathArray = route.path.split('/').filter(path => path)
  const breadcrumbs = []
  
  // 对于dashboard路径，添加首页
  if (route.path !== '/' && route.path !== '/dashboard') {
    breadcrumbs.push({
      path: '/dashboard',
              title: '仪表盘',
      icon: House
    })
  }
  
  // 构建路径面包屑
  let currentPath = ''
  pathArray.forEach((path, index) => {
    currentPath += `/${path}`
    
    // 如果当前路径是dashboard且不是当前页面，跳过（因为已经作为首页添加了）
    if (currentPath === '/dashboard' && route.path !== '/dashboard') return
    
    const title = routeTitleMap[currentPath] || path
    const icon = routeIconMap[currentPath]
    
    breadcrumbs.push({
      path: currentPath,
      title,
      icon
    })
  })
  
  return breadcrumbs
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  padding: 0 4px;
  
  .custom-breadcrumb {
    :deep(.el-breadcrumb__item) {
      .el-breadcrumb__inner {
        display: flex;
        align-items: center;
        color: #b7bdc6;
        font-weight: 500;
        transition: all 0.2s ease;
        
        .breadcrumb-icon {
          margin-right: 6px;
          font-size: 14px;
        }
      }
      
      .breadcrumb-link {
        display: flex;
        align-items: center;
        color: #b7bdc6;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          color: #f0b90b;
        }
        
        .breadcrumb-icon {
          margin-right: 6px;
          font-size: 14px;
        }
      }
      
      &.is-current {
        .el-breadcrumb__inner {
          color: #f0b90b;
          font-weight: 600;
        }
      }
      
      .el-breadcrumb__separator {
        color: #5e6673;
        margin: 0 8px;
      }
    }
  }
}
</style> 
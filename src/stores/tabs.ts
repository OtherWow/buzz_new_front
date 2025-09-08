import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
  path: string
  name: string
  title: string
  icon?: string
  closable: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  // 页签列表
  const tabs = ref<TabItem[]>([
    {
      path: '/dashboard',
      name: 'Dashboard',
      title: '仪表盘',
      icon: 'House',
      closable: false // 首页不可关闭
    }
  ])
  
  // 当前激活的页签
  const activeTab = ref('/dashboard')
  
  // 添加页签
  const addTab = (route: RouteLocationNormalized) => {
    const { path, name, meta } = route
    
    // 检查是否已存在
    const existingTab = tabs.value.find(tab => tab.path === path)
    if (existingTab) {
      activeTab.value = path
      return
    }
    
        // 页面标题映射
    const titleMap: Record<string, string> = {
      '/': '仪表盘',
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
    
    // 图标映射
    const iconMap: Record<string, string> = {
      '/': 'House',
      '/dashboard': 'House',
      '/transactions': 'TrendCharts',
      '/transactions/create': 'Plus',
      '/transactions/detail': 'Document',
      '/users': 'User',
      '/roles': 'UserFilled',
      '/permissions': 'Lock',
      '/profile': 'User',
      '/settings': 'Setting'
    }
    
    const newTab: TabItem = {
      path,
      name: (name as string) || path,
      title: titleMap[path] || meta?.title as string || '未知页面',
      icon: iconMap[path],
      closable: path !== '/dashboard' && path !== '/' // 首页不可关闭
    }
    
    tabs.value.push(newTab)
    activeTab.value = path
  }
  
  // 移除页签
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index === -1 || !tabs.value[index].closable) return
    
    // 如果关闭的是当前激活的页签
    if (activeTab.value === path) {
      // 激活前一个页签，如果没有则激活后一个
      const nextActiveIndex = index > 0 ? index - 1 : index + 1
      if (tabs.value[nextActiveIndex]) {
        activeTab.value = tabs.value[nextActiveIndex].path
      } else {
        activeTab.value = '/dashboard' // 默认回到首页
      }
    }
    
    tabs.value.splice(index, 1)
    return activeTab.value
  }
  
  // 关闭其他页签
  const closeOtherTabs = (currentPath: string) => {
    tabs.value = tabs.value.filter(tab => 
      tab.path === currentPath || !tab.closable
    )
    activeTab.value = currentPath
  }
  
  // 关闭所有页签（除了不可关闭的）
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(tab => !tab.closable)
    activeTab.value = '/dashboard'
  }
  
  // 设置激活页签
  const setActiveTab = (path: string) => {
    activeTab.value = path
  }
  
  // 获取当前页签
  const getCurrentTab = computed(() => {
    return tabs.value.find(tab => tab.path === activeTab.value)
  })
  
  return {
    tabs: computed(() => tabs.value),
    activeTab: computed(() => activeTab.value),
    currentTab: getCurrentTab,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
    setActiveTab
  }
}) 
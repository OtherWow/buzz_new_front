<template>
  <div class="tabs-view" v-if="tabs.length > 0">
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <div 
          v-for="tab in tabs" 
          :key="tab.path"
          class="tab-item"
          :class="{ 'is-active': activeTab === tab.path }"
          @click="handleTabClick(tab.path)"
          @contextmenu.prevent="showContextMenu($event, tab)"
        >
          <el-icon v-if="tab.icon" class="tab-icon">
            <component :is="getIconComponent(tab.icon)" />
          </el-icon>
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon 
            v-if="tab.closable" 
            class="tab-close"
            @click.stop="handleTabClose(tab.path)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
      
      <!-- 右键菜单 -->
      <div 
        v-show="contextMenuVisible"
        class="context-menu"
        :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
        @click="hideContextMenu"
      >
        <div class="menu-item" @click="refreshTab" v-if="contextTab">
          <el-icon><Refresh /></el-icon>
          刷新
        </div>
        <div 
          class="menu-item" 
          @click="closeTab" 
          v-if="contextTab?.closable"
        >
          <el-icon><Close /></el-icon>
          关闭
        </div>
        <div class="menu-item" @click="closeOtherTabs">
          <el-icon><CircleClose /></el-icon>
          关闭其他
        </div>
        <div class="menu-item" @click="closeAllTabs">
          <el-icon><CircleClose /></el-icon>
          关闭所有
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore, type TabItem } from '@/stores/tabs'
import { 
  Close, 
  Refresh, 
  CircleClose,
  House, 
  TrendCharts, 
  User, 
  UserFilled, 
  Lock, 
  Setting,
  Plus,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

const tabs = computed(() => tabsStore.tabs)
const activeTab = computed(() => tabsStore.activeTab)

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextTab = ref<TabItem | null>(null)

// 图标组件映射
const iconComponents: Record<string, any> = {
  House,
  TrendCharts,
  User,
  UserFilled,
  Lock,
  Setting,
  Plus,
  Document
}

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName] || House
}

// 处理页签点击
const handleTabClick = (path: string) => {
  if (activeTab.value !== path) {
    tabsStore.setActiveTab(path)
    router.push(path)
  }
}

// 处理页签关闭
const handleTabClose = (path: string) => {
  const nextActivePath = tabsStore.removeTab(path)
  if (nextActivePath && nextActivePath !== path) {
    router.push(nextActivePath)
  }
}

// 显示右键菜单
const showContextMenu = (event: MouseEvent, tab: TabItem) => {
  contextTab.value = tab
  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
  contextMenuVisible.value = true
}

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenuVisible.value = false
  contextTab.value = null
}

// 刷新当前页签
const refreshTab = () => {
  if (contextTab.value) {
    window.location.reload()
  }
  hideContextMenu()
}

// 关闭当前页签
const closeTab = () => {
  if (contextTab.value) {
    handleTabClose(contextTab.value.path)
  }
  hideContextMenu()
}

// 关闭其他页签
const closeOtherTabs = () => {
  if (contextTab.value) {
    tabsStore.closeOtherTabs(contextTab.value.path)
    router.push(contextTab.value.path)
  }
  hideContextMenu()
}

// 关闭所有页签
const closeAllTabs = () => {
  tabsStore.closeAllTabs()
  router.push('/')
  hideContextMenu()
}

// 点击其他地方隐藏右键菜单
const handleClickOutside = () => {
  hideContextMenu()
}

// 监听路由变化，同步页签状态
watch(() => route.path, (newPath) => {
  if (newPath && tabsStore.activeTab !== newPath) {
    tabsStore.setActiveTab(newPath)
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.tabs-view {
  background: #1e2329;
  border-bottom: 1px solid #2b3139;
  
  .tabs-container {
    position: relative;
    
    .tabs-wrapper {
      display: flex;
      align-items: center;
      padding: 0 16px;
      overflow-x: auto;
      white-space: nowrap;
      
      &::-webkit-scrollbar {
        height: 3px;
      }
      
      &::-webkit-scrollbar-track {
        background: #1e2329;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #2b3139;
        border-radius: 2px;
      }
      
      .tab-item {
        display: inline-flex;
        align-items: center;
        padding: 10px 16px;
        margin: 8px 4px 0 0;
        background: #2b3139;
        border: 1px solid #383a3e;
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        position: relative;
        
        &:hover {
          background: #383a3e;
          border-color: rgba(240, 185, 11, 0.3);
        }
        
        &.is-active {
          background: #0b0e11;
          border-color: #f0b90b;
          border-bottom: 1px solid #0b0e11;
          margin-bottom: -1px;
          
          .tab-title {
            color: #f0b90b;
            font-weight: 600;
          }
          
          .tab-icon {
            color: #f0b90b;
          }
        }
        
        .tab-icon {
          font-size: 14px;
          color: #b7bdc6;
          margin-right: 8px;
          flex-shrink: 0;
        }
        
        .tab-title {
          color: #b7bdc6;
          font-size: 13px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .tab-close {
          font-size: 12px;
          color: #848e9c;
          margin-left: 8px;
          padding: 2px;
          border-radius: 2px;
          flex-shrink: 0;
          
          &:hover {
            background: rgba(246, 70, 93, 0.2);
            color: #f6465d;
          }
        }
      }
    }
  }
}

// 右键菜单
.context-menu {
  position: fixed;
  background: #1e2329;
  border: 1px solid #2b3139;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  min-width: 120px;
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    color: #b7bdc6;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(240, 185, 11, 0.1);
      color: #f0b90b;
    }
    
    .el-icon {
      margin-right: 8px;
      font-size: 14px;
    }
    
    &:first-child {
      border-radius: 6px 6px 0 0;
    }
    
    &:last-child {
      border-radius: 0 0 6px 6px;
    }
  }
}
</style> 
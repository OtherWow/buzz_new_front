<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px" class="sidebar">
        <div class="logo">
                      <h2>BUZZ</h2>
        </div>
        <LayoutSidebar />
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header height="60px" class="header">
          <LayoutHeader />
        </el-header>
        
        <!-- 页签区域 -->
        <TabsView />
        
        <!-- 主要内容 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import LayoutSidebar from './components/Sidebar.vue'
import LayoutHeader from './components/Header.vue'
import TabsView from '@/components/TabsView.vue'
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: #1e2329;
  border-right: 1px solid #2b3139;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #2b3139;
    background: #1e2329;
    
    h2 {
      color: #f0b90b;
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 0 10px rgba(240, 185, 11, 0.3);
    }
  }
}

.header {
  background: #1e2329;
  border-bottom: 1px solid #2b3139;
  display: flex;
  align-items: center;
  padding: 0;
}

.main {
  background: #0b0e11;
  padding: 20px;
  overflow-y: auto;
}
</style> 
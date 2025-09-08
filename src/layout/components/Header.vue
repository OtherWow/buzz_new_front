<template>
  <div class="header-container">
    <div class="left">
      <!-- 面包屑导航 -->
      <Breadcrumb />
    </div>
    
    <div class="center">
      <!-- BTC价格显示 -->
      <BTCPrice />
    </div>
    
    <div class="right">
      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userInfo?.avatar || ''" class="user-avatar">
            {{ !userInfo?.avatar ? (userInfo?.real_name || userInfo?.username)?.charAt(0) : '' }}
          </el-avatar>
          <span class="username">{{ userInfo?.real_name || userInfo?.username || '用户' }}</span>
          <el-icon class="arrow-down">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人设置
            </el-dropdown-item>
            <el-dropdown-item command="changePassword">
              <el-icon><Lock /></el-icon>
              修改密码
            </el-dropdown-item>
            <!-- 角色切换子菜单 -->
            <el-dropdown-item v-if="availableRoles.length > 1" command="switchRole">
              <el-icon><UserFilled /></el-icon>
              切换角色
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 角色切换对话框 -->
    <RoleSwitcher 
      v-model="showRoleSwitcher"
      :available-roles="availableRoles"
      @switch-success="handleSwitchSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ArrowDown, User, Lock, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import RoleSwitcher from './RoleSwitcher.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import BTCPrice from '@/components/BTCPrice.vue'
import type { Role } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.user)
const pageTitle = computed(() => route.meta?.title || '仪表盘')
const availableRoles = ref<Role[]>([])
const showRoleSwitcher = ref(false)

// 获取可切换的角色列表
const loadAvailableRoles = async () => {
  const roles = await authStore.getAvailableRoles()
  availableRoles.value = roles || []
}

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人设置页面
      router.push('/profile')
      break
    case 'changePassword':
      // 跳转到修改密码页面
      router.push('/change-password')
      break
    case 'switchRole':
      handleSwitchRole()
      break
    case 'logout':
      await handleLogout()
      break
  }
}

const handleSwitchRole = () => {
  if (availableRoles.value.length <= 1) {
    ElMessage.info('当前用户只有一个角色，无需切换')
    return
  }
  showRoleSwitcher.value = true
}

const handleSwitchSuccess = () => {
  // 重新加载可用角色列表
  loadAvailableRoles()
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    authStore.logout()
    router.push('/login')
  } catch {
    // 用户取消操作
  }
}

onMounted(() => {
  loadAvailableRoles()
})
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.left {
  flex: 1;
  min-width: 0;
}

.center {
  flex: 0 0 auto;
  margin: 0 20px;
}

.right {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(240, 185, 11, 0.1);
      border-color: rgba(240, 185, 11, 0.3);
    }
    
    .user-avatar {
      background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
      color: #0b0e11;
      font-weight: 600;
      font-size: 14px;
    }
    
    .username {
      margin: 0 12px;
      font-size: 14px;
      font-weight: 500;
      color: #f0b90b;
    }
    
    .arrow-down {
      font-size: 14px;
      color: #b7bdc6;
    }
  }
}
</style> 
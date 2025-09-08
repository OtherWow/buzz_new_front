<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h3>个人设置</h3>
        </div>
      </template>
      
      <el-row :gutter="24">
        <!-- 用户信息 -->
        <el-col :span="12">
          <div class="info-section">
            <h4>用户信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>用户名:</label>
                <span>{{ userInfo?.username || '未知' }}</span>
              </div>
              <div class="info-item">
                <label>真实姓名:</label>
                <span>{{ userInfo?.real_name || '未设置' }}</span>
              </div>
              <div class="info-item">
                <label>邮箱:</label>
                <span>{{ userInfo?.email || '未设置' }}</span>
              </div>
              <div class="info-item">
                <label>手机号:</label>
                <span>{{ userInfo?.phone || '未设置' }}</span>
              </div>
              <div class="info-item">
                <label>当前角色:</label>
                <el-tag type="warning">{{ userInfo?.role?.name || '未知角色' }}</el-tag>
              </div>
              <div class="info-item">
                <label>角色描述:</label>
                <span>{{ userInfo?.role?.description || '暂无描述' }}</span>
              </div>
                             <div class="info-item">
                 <label>账户状态:</label>
                 <el-tag :type="userInfo?.is_active ? 'success' : 'danger'">
                   {{ userInfo?.is_active ? '正常' : '禁用' }}
                 </el-tag>
               </div>
              <div class="info-item">
                <label>注册时间:</label>
                <span>{{ formatDate(userInfo?.created_at) }}</span>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 权限信息 -->
        <el-col :span="12">
          <div class="info-section">
            <h4>权限信息</h4>
            <div class="permissions-grid">
              <div v-for="permission in userPermissions" :key="permission.id" class="permission-item">
                <el-tag size="small" type="info">{{ permission.name }}</el-tag>
                <span class="permission-desc">{{ permission.description }}</span>
              </div>
              <div v-if="userPermissions.length === 0" class="no-permissions">
                暂无权限信息
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- 系统信息 -->
    <el-card class="system-card">
      <template #header>
        <div class="card-header">
          <h3>系统信息</h3>
        </div>
      </template>
      
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">系统名称</div>
            <div class="system-value">BUZZ 交易系统</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">系统版本</div>
            <div class="system-value">v1.0.0</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">构建日期</div>
            <div class="system-value">{{ buildDate }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">运行环境</div>
            <div class="system-value">{{ isDev ? '开发环境' : '生产环境' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">浏览器</div>
            <div class="system-value">{{ browserInfo }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="system-item">
            <div class="system-label">屏幕分辨率</div>
            <div class="system-value">{{ screenResolution }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- 操作按钮 -->
    <div class="actions">
      <el-button type="primary" @click="handleEditProfile">
        <el-icon><Edit /></el-icon>
        编辑资料
      </el-button>
      <el-button @click="handleChangePassword">
        <el-icon><Lock /></el-icon>
        修改密码
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新信息
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Lock, Refresh } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const userInfo = computed(() => authStore.user)
const userPermissions = computed(() => authStore.user?.role?.permissions || [])

// 系统信息
const buildDate = ref(new Date().toLocaleDateString('zh-CN'))
const isDev = computed(() => import.meta.env.DEV)
const browserInfo = ref('')
const screenResolution = ref('')

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '未知'
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取浏览器信息
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) {
    browserInfo.value = 'Chrome ' + userAgent.match(/Chrome\/(\d+)/)?.[1]
  } else if (userAgent.includes('Firefox')) {
    browserInfo.value = 'Firefox ' + userAgent.match(/Firefox\/(\d+)/)?.[1]
  } else if (userAgent.includes('Safari')) {
    browserInfo.value = 'Safari ' + userAgent.match(/Version\/(\d+)/)?.[1]
  } else if (userAgent.includes('Edge')) {
    browserInfo.value = 'Edge ' + userAgent.match(/Edg\/(\d+)/)?.[1]
  } else {
    browserInfo.value = '未知浏览器'
  }
}

// 获取屏幕分辨率
const getScreenResolution = () => {
  screenResolution.value = `${screen.width}x${screen.height}`
}

// 处理编辑资料
const handleEditProfile = () => {
  ElMessage.info('编辑资料功能开发中...')
}

// 处理修改密码
const handleChangePassword = () => {
  ElMessage.info('修改密码功能开发中...')
}

// 刷新信息
const handleRefresh = () => {
  getBrowserInfo()
  getScreenResolution()
  ElMessage.success('信息已刷新')
}

onMounted(() => {
  getBrowserInfo()
  getScreenResolution()
})
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  
  .profile-card, .system-card {
    margin-bottom: 24px;
    background: #1e2329;
    border: 1px solid #2b3139;
    
    :deep(.el-card__header) {
      background: #1e2329;
      border-bottom: 1px solid #2b3139;
      
      .card-header {
        h3 {
          margin: 0;
          color: #eaecef;
          font-weight: 600;
        }
      }
    }
    
    :deep(.el-card__body) {
      background: #1e2329;
      color: #eaecef;
    }
  }
  
  .info-section {
    h4 {
      color: #f0b90b;
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .info-grid {
      display: grid;
      gap: 16px;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        label {
          color: #b7bdc6;
          font-weight: 500;
          min-width: 80px;
          font-size: 14px;
        }
        
        span {
          color: #eaecef;
          font-size: 14px;
        }
      }
    }
    
    .permissions-grid {
      display: grid;
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
      
      .permission-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: #2b3139;
        border-radius: 6px;
        
        .permission-desc {
          color: #848e9c;
          font-size: 13px;
        }
      }
      
      .no-permissions {
        color: #848e9c;
        text-align: center;
        padding: 20px;
        font-style: italic;
      }
    }
  }
  
  .system-item {
    text-align: center;
    padding: 16px;
    background: #2b3139;
    border-radius: 8px;
    margin-bottom: 16px;
    
    .system-label {
      color: #b7bdc6;
      font-size: 13px;
      margin-bottom: 8px;
    }
    
    .system-value {
      color: #f0b90b;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    
    .el-button {
      border-radius: 8px;
      font-weight: 600;
      padding: 12px 24px;
    }
    
    .el-button--primary {
      background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
      border: none;
      color: #0b0e11;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(240, 185, 11, 0.4);
      }
    }
    
    .el-button--default {
      background: #2b3139;
      border-color: #383a3e;
      color: #b7bdc6;
      
      &:hover {
        background: #383a3e;
        border-color: #474d57;
        color: #eaecef;
      }
    }
  }
}
</style> 
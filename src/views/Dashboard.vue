<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>欢迎回来，{{ userInfo?.real_name || userInfo?.username }}！</h1>
      <p>当前角色：{{ userInfo?.role?.name }}</p>
    </div>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-if="hasPermission('transaction:read')">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon transaction">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.totalTransactions }}</div>
              <div class="stats-label">总交易数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" v-if="hasPermission('user:read')">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon user">
              <el-icon><User /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.totalUsers }}</div>
              <div class="stats-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" v-if="hasPermission('role:read')">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon role">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.totalRoles }}</div>
              <div class="stats-label">角色数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon online">
              <el-icon><Connection /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.onlineUsers }}</div>
              <div class="stats-label">在线用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作 -->
    <el-card class="quick-actions" v-if="quickActions.length > 0">
      <template #header>
        <h3>快捷操作</h3>
      </template>
      <el-row :gutter="16">
        <el-col :span="6" v-for="action in quickActions" :key="action.key">
          <el-button
            type="primary"
            :icon="action.icon"
            @click="handleQuickAction(action.key)"
            class="quick-action-btn"
          >
            {{ action.label }}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- 最近交易 -->
    <el-card class="recent-transactions" v-if="hasPermission('transaction:read')">
      <template #header>
        <div class="card-header">
          <h3>最近交易</h3>
          <el-button type="text" @click="$router.push('/transactions')">
            查看更多
          </el-button>
        </div>
      </template>
      <el-table :data="recentTransactions" stripe>
        <el-table-column prop="transaction_no" label="交易号" width="200">
          <template #default="{ row }">
            <span class="transaction-no">{{ row.transaction_no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名称" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'buy' ? 'success' : 'warning'">
              {{ row.type === 'buy' ? '买入' : '卖出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="金额" width="140" align="right">
          <template #default="{ row }">
            <span class="amount-text" :class="row.type === 'buy' ? 'amount-buy' : 'amount-sell'">
              {{ row.type === 'buy' ? '+' : '-' }}${{ row.total_amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Money, User, UserFilled, Connection, Plus, Setting } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { Transaction } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.user)
const hasPermission = (permission: string) => authStore.hasPermission(permission)

// 统计数据
const stats = ref({
  totalTransactions: 156,
  totalUsers: 48,
  totalRoles: 5,
  onlineUsers: 12
})

// 最近交易数据
const recentTransactions = ref<Transaction[]>([
  {
    id: 1,
    transaction_no: 'TXN20240101001',
    type: 'buy',
    product_name: '苹果股票',
    quantity: 100,
    unit_price: 150,
    total_amount: 15000,
    status: 'completed',
    user_id: 1,
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    transaction_no: 'TXN20240101002',
    type: 'sell',
    product_name: '腾讯股票',
    quantity: 50,
    unit_price: 320,
    total_amount: 16000,
    status: 'pending',
    user_id: 2,
    created_at: '2024-01-01 11:00:00',
    updated_at: '2024-01-01 11:00:00'
  }
])

// 快捷操作
const quickActions = computed(() => {
  const actions = []
  
  if (hasPermission('transaction:create')) {
    actions.push({
      key: 'create-transaction',
      label: '创建交易',
      icon: Plus
    })
  }
  
  if (hasPermission('user:create')) {
    actions.push({
      key: 'create-user',
      label: '创建用户',
      icon: User
    })
  }
  
  if (hasPermission('system:manage')) {
    actions.push({
      key: 'system-settings',
      label: '系统设置',
      icon: Setting
    })
  }
  
  return actions
})

const handleQuickAction = (key: string) => {
  switch (key) {
    case 'create-transaction':
      router.push('/transactions/create')
      break
    case 'create-user':
      router.push('/users/create')
      break
    case 'system-settings':
      router.push('/settings')
      break
  }
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'info',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消',
    failed: '失败'
  }
  return statusMap[status] || status
}

onMounted(() => {
  // 这里可以调用API获取真实数据
  console.log('Dashboard mounted')
})
</script>

<style lang="scss" scoped>
.dashboard {
  .dashboard-header {
    margin-bottom: 32px;
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #eaecef;
      margin-bottom: 8px;
    }
    
    p {
      color: #b7bdc6;
      font-size: 16px;
    }
  }
  
  .stats-row {
    margin-bottom: 32px;
  }
  
  .stats-card {
    background: #1e2329;
    border: 1px solid #2b3139;
    transition: all 0.3s ease;
    
    :deep(.el-card__body) {
      background: #1e2329;
      padding: 20px;
    }
    
    &:hover {
      border-color: rgba(240, 185, 11, 0.3);
      box-shadow: 0 4px 20px rgba(240, 185, 11, 0.1);
      transform: translateY(-2px);
    }
    
    .stats-content {
      display: flex;
      align-items: center;
      
      .stats-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        position: relative;
        
        .el-icon {
          font-size: 28px;
          color: #0b0e11;
          z-index: 2;
        }
        
        &.transaction {
          background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
          box-shadow: 0 4px 12px rgba(240, 185, 11, 0.4);
        }
        
        &.user {
          background: linear-gradient(135deg, #0ecb81 0%, #2dd4aa 100%);
          box-shadow: 0 4px 12px rgba(14, 203, 129, 0.4);
        }
        
        &.role {
          background: linear-gradient(135deg, #f6465d 0%, #ff6b82 100%);
          box-shadow: 0 4px 12px rgba(246, 70, 93, 0.4);
        }
        
        &.online {
          background: linear-gradient(135deg, #1677ff 0%, #40a9ff 100%);
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
        }
      }
      
      .stats-info {
        .stats-value {
          font-size: 32px;
          font-weight: 700;
          color: #eaecef;
          line-height: 1;
          margin-bottom: 8px;
        }
        
        .stats-label {
          font-size: 14px;
          color: #848e9c;
          font-weight: 500;
        }
      }
    }
  }
  
  .quick-actions {
    margin-bottom: 32px;
    background: #1e2329;
    border: 1px solid #2b3139;
    
    :deep(.el-card__header) {
      background: #1e2329;
      border-bottom: 1px solid #2b3139;
      
      h3 {
        color: #eaecef;
        font-weight: 600;
      }
    }
    
    :deep(.el-card__body) {
      background: #1e2329;
      padding: 20px;
    }
    
    .quick-action-btn {
      width: 100%;
      height: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
      border: none;
      color: #0b0e11;
      border-radius: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(240, 185, 11, 0.4);
      }
    }
  }
  
  .recent-transactions {
    background: #1e2329;
    border: 1px solid #2b3139;
    
    :deep(.el-card__header) {
      background: #1e2329;
      border-bottom: 1px solid #2b3139;
    }
    
    :deep(.el-card__body) {
      background: #1e2329;
      padding: 20px;
    }
    

    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
        color: #eaecef;
        font-weight: 600;
      }
      
      .el-button--text {
        color: #f0b90b;
        
        &:hover {
          color: #fcd535;
        }
      }
    }
  }
  
  // 交易号样式
  .transaction-no {
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #eaecef;
    background: #2b3139;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #383a3e;
    font-weight: 500;
    letter-spacing: 0.5px;
    
    &:hover {
      background: #383a3e;
      border-color: rgba(240, 185, 11, 0.4);
      color: #f0b90b;
      transition: all 0.2s ease;
    }
  }
  
  // 金额显示样式
  .amount-text {
    font-weight: 600;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    
    &.amount-buy {
      color: #0ecb81;
    }
    
    &.amount-sell {
      color: #f6465d;
    }
  }
}
</style> 
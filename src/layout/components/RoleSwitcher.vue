<template>
  <el-dialog
    v-model="visible"
    title="角色切换"
    width="400px"
    :before-close="handleClose"
    center
  >
    <div class="role-switcher">
      <div class="current-role">
        <h4>当前角色</h4>
        <div class="role-item current">
          <el-icon class="role-icon"><UserFilled /></el-icon>
          <div class="role-info">
            <div class="role-name">{{ currentRole?.name }}</div>
            <div class="role-desc">{{ currentRole?.description }}</div>
          </div>
        </div>
      </div>

      <div class="available-roles" v-if="otherRoles.length > 0">
        <h4>可切换角色</h4>
        <div 
          v-for="role in otherRoles" 
          :key="role.id"
          class="role-item clickable"
          @click="selectRole(role)"
          :class="{ selected: selectedRoleId === role.id }"
        >
          <el-icon class="role-icon"><User /></el-icon>
          <div class="role-info">
            <div class="role-name">{{ role.name }}</div>
            <div class="role-desc">{{ role.description }}</div>
          </div>
        </div>
      </div>

      <div v-else class="no-roles">
        <el-empty description="没有其他可切换的角色" :image-size="80" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmSwitch"
          :disabled="!selectedRoleId"
          :loading="switching"
        >
          {{ switching ? '切换中...' : '确认切换' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

interface Props {
  modelValue: boolean
  availableRoles: Role[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'switch-success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const visible = ref(false)
const selectedRoleId = ref<number | null>(null)
const switching = ref(false)

const currentRole = computed(() => authStore.user?.role)
const currentRoleId = computed(() => authStore.user?.role_id)

const otherRoles = computed(() => {
  return props.availableRoles.filter(role => role.id !== currentRoleId.value)
})

const selectRole = (role: Role) => {
  selectedRoleId.value = role.id
}

const confirmSwitch = async () => {
  if (!selectedRoleId.value) {
    ElMessage.warning('请选择要切换的角色')
    return
  }

  switching.value = true
  try {
    const success = await authStore.switchRole(selectedRoleId.value)
    if (success) {
      emit('switch-success')
      handleClose()
      ElMessage.success('角色切换成功！菜单权限已更新')
      // 不需要刷新页面，Vue的响应式会自动更新界面
    }
  } catch (error) {
    ElMessage.error('角色切换失败，请重试')
  } finally {
    switching.value = false
  }
}

const handleClose = () => {
  visible.value = false
  selectedRoleId.value = null
  switching.value = false
}

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听visible变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style lang="scss" scoped>
.role-switcher {
  :deep(.el-dialog) {
    background: #1e2329;
    border: 1px solid #2b3139;
  }
  
  :deep(.el-dialog__header) {
    background: #1e2329;
    border-bottom: 1px solid #2b3139;
  }
  
  :deep(.el-dialog__title) {
    color: #eaecef;
    font-weight: 600;
  }
  
  :deep(.el-dialog__body) {
    background: #1e2329;
    color: #eaecef;
  }
  
  .current-role {
    margin-bottom: 32px;
    
    h4 {
      font-size: 16px;
      color: #b7bdc6;
      margin-bottom: 16px;
      font-weight: 600;
    }
  }
  
  .available-roles {
    h4 {
      font-size: 16px;
      color: #b7bdc6;
      margin-bottom: 16px;
      font-weight: 600;
    }
  }
  
  .role-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border: 1px solid #2b3139;
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    background: #2b3139;
    
    &.current {
      background: rgba(240, 185, 11, 0.1);
      border: 2px solid rgba(240, 185, 11, 0.3);
      box-shadow: 0 0 0 2px rgba(240, 185, 11, 0.1);
    }
    
    &.clickable {
      cursor: pointer;
      
      &:hover {
        border-color: rgba(240, 185, 11, 0.5);
        background: rgba(240, 185, 11, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(240, 185, 11, 0.1);
      }
      
      &.selected {
        border-color: #f0b90b;
        background: rgba(240, 185, 11, 0.1);
        box-shadow: 0 0 0 2px rgba(240, 185, 11, 0.2);
      }
    }
    
    .role-icon {
      font-size: 24px;
      color: #f0b90b;
      margin-right: 16px;
    }
    
    .role-info {
      flex: 1;
      
      .role-name {
        font-size: 16px;
        font-weight: 600;
        color: #eaecef;
        margin-bottom: 6px;
      }
      
      .role-desc {
        font-size: 13px;
        color: #848e9c;
        line-height: 1.4;
      }
    }
    
    .current-badge {
      background: linear-gradient(135deg, #0ecb81 0%, #2dd4aa 100%);
      color: #0b0e11;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 16px;
      box-shadow: 0 2px 6px rgba(14, 203, 129, 0.3);
    }
  }
  
  .no-roles {
    text-align: center;
    padding: 32px 0;
    color: #848e9c;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  background: #1e2329;
  border-top: 1px solid #2b3139;
  
  .el-button {
    border-radius: 8px;
    font-weight: 600;
    padding: 10px 24px;
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
  
  .el-button--primary {
    background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
    border: none;
    color: #0b0e11;
    box-shadow: 0 4px 12px rgba(240, 185, 11, 0.4);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(240, 185, 11, 0.5);
    }
    
    &:disabled, &.is-disabled {
      background: #383a3e !important;
      color: #5e6673 !important;
      box-shadow: none !important;
      transform: none !important;
      border: 1px solid #383a3e !important;
    }
  }
}
</style> 
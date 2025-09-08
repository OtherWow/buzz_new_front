<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
                    <h1>BUZZ 交易系统</h1>
        <p>欢迎登录</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            clearable
            class="modern-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            class="modern-input"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="modern-login-btn"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="demo-accounts">
        <h4>测试账号</h4>
        <div class="demo-item">
          <span>管理员：admin / admin123</span>
        </div>
        <div class="demo-item">
          <span>操作员：operator / operator123</span>
        </div>
        <div class="demo-item">
          <span>普通用户：user / user123</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ]
}



const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  loading.value = true
  
  try {
    const success = await authStore.login(loginForm)
    if (success) {
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0b0e11 0%, #1e2329 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: #1e2329;
  border: 2px solid rgba(240, 185, 11, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(240, 185, 11, 0.1);
  padding: 48px 40px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 12px 0;
    background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(240, 185, 11, 0.3));
  }
  
  p {
    color: #b7bdc6;
    font-size: 16px;
    margin: 0;
    font-weight: 400;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 28px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .modern-input {
    background: #2b3139 !important;
    
    :deep(.el-input__wrapper) {
      background: #2b3139 !important;
      border: 1px solid #383a3e;
      border-radius: 8px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 14px 16px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(240, 185, 11, 0.5);
        background: #343a42 !important;
      }
      
      &.is-focus {
        border-color: #f0b90b;
        background: #343a42 !important;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(240, 185, 11, 0.1);
      }
      
      .el-input__inner {
        color: #eaecef !important;
        background: transparent !important;
        font-size: 15px;
        font-weight: 500;
        
        &::placeholder {
          color: #848e9c !important;
          font-weight: 400;
        }
      }
      
      .el-input__prefix {
        .input-icon {
          color: #f0b90b;
          font-size: 16px;
          margin-right: 8px;
        }
      }
      
      .el-input__suffix {
        .el-input__clear,
        .el-input__password {
          color: #848e9c;
          
          &:hover {
            color: #f0b90b;
          }
        }
      }
    }
    
    // 额外确保输入框内部背景是深色
    :deep(input) {
      background: transparent !important;
      color: #eaecef !important;
    }
    
    // 覆盖浏览器自动填充的白色背景
    :deep(input:-webkit-autofill) {
      -webkit-box-shadow: 0 0 0 1000px #2b3139 inset !important;
      -webkit-text-fill-color: #eaecef !important;
      background: #2b3139 !important;
    }
  }
  
  .modern-login-btn {
    width: 100%;
    height: 52px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    background: linear-gradient(135deg, #f0b90b 0%, #fcd535 100%);
    border: none;
    color: #0b0e11;
    box-shadow: 0 4px 16px rgba(240, 185, 11, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(240, 185, 11, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &.is-loading {
      .el-loading-spinner {
        .el-loading-spinner__path {
          stroke: #0b0e11;
        }
      }
    }
  }
}

.demo-accounts {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(240, 185, 11, 0.2);
  
  h4 {
    font-size: 14px;
    color: #b7bdc6;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 500;
  }
  
  .demo-item {
    font-size: 13px;
    color: #848e9c;
    text-align: center;
    margin-bottom: 8px;
    
    span {
      background: rgba(240, 185, 11, 0.1);
      color: #f0b90b;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  }
}
</style> 
<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">403</div>
      <div class="error-title">抱歉，您没有权限访问此页面</div>
      <div class="error-description">
        您当前的角色权限不足，无法访问此功能。如需访问，请联系系统管理员。
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">
          返回上一页
        </el-button>
        <el-button @click="goHome">
          回到首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-content {
  text-align: center;
  color: white;
  
  .error-code {
    font-size: 120px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  
  .error-title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .error-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
    max-width: 400px;
    line-height: 1.6;
  }
  
  .error-actions {
    .el-button {
      margin: 0 8px;
    }
  }
}
</style> 
<template>
  <div class="test-api-container">
    <el-card>
      <template #header>
        <h3>API对接测试</h3>
      </template>
      
      <el-space direction="vertical" style="width: 100%" size="large">
        <!-- JWT登录测试 -->
        <el-card>
          <template #header>
            <h4>JWT登录测试</h4>
          </template>
          <el-form :inline="true" :model="loginForm">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" placeholder="输入密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="testJWTLogin" :loading="testingLogin">
                测试登录
              </el-button>
            </el-form-item>
          </el-form>
          <div v-if="loginResult" class="result">
            <h5>登录结果：</h5>
            <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
          </div>
        </el-card>

        <!-- 获取用户权限测试 -->
        <el-card>
          <template #header>
            <h4>获取用户权限测试</h4>
          </template>
          <el-button type="primary" @click="testGetPermissions" :loading="testingPermissions">
            获取我的权限
          </el-button>
          <div v-if="permissionsResult" class="result">
            <h5>权限结果：</h5>
            <pre>{{ JSON.stringify(permissionsResult, null, 2) }}</pre>
          </div>
        </el-card>

        <!-- 角色管理测试 -->
        <el-card>
          <template #header>
            <h4>角色管理测试</h4>
          </template>
          <el-space>
            <el-button type="primary" @click="testGetRoles" :loading="testingRoles">
              获取角色列表
            </el-button>
            <el-button type="success" @click="testCreateRole" :loading="testingCreateRole">
              创建测试角色
            </el-button>
          </el-space>
          <div v-if="rolesResult" class="result">
            <h5>角色结果：</h5>
            <pre>{{ JSON.stringify(rolesResult, null, 2) }}</pre>
          </div>
        </el-card>

        <!-- 菜单权限测试 -->
        <el-card>
          <template #header>
            <h4>菜单权限测试</h4>
          </template>
          <el-space>
            <el-button type="primary" @click="testGetMenuTree" :loading="testingMenuTree">
              获取菜单树
            </el-button>
            <el-button type="success" @click="testCreateMenu" :loading="testingCreateMenu">
              创建测试菜单
            </el-button>
          </el-space>
          <div v-if="menuTreeResult" class="result">
            <h5>菜单树结果：</h5>
            <pre>{{ JSON.stringify(menuTreeResult, null, 2) }}</pre>
          </div>
        </el-card>

        <!-- 权限检查测试 -->
        <el-card>
          <template #header>
            <h4>权限检查测试</h4>
          </template>
          <el-form :inline="true">
            <el-form-item label="权限标识">
              <el-input v-model="permissionIdentifier" placeholder="如：user:add" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="testCheckPermission" :loading="testingCheckPermission">
                检查权限
              </el-button>
            </el-form-item>
          </el-form>
          <div v-if="checkPermissionResult" class="result">
            <h5>权限检查结果：</h5>
            <pre>{{ JSON.stringify(checkPermissionResult, null, 2) }}</pre>
          </div>
        </el-card>

        <!-- 连接状态 -->
        <el-card>
          <template #header>
            <h4>后端连接状态</h4>
          </template>
          <el-space>
            <el-button type="primary" @click="testConnection" :loading="testingConnection">
              测试连接
            </el-button>
            <el-tag :type="connectionStatus === 'success' ? 'success' : 'danger'">
              {{ connectionStatus === 'success' ? '连接正常' : '连接失败' }}
            </el-tag>
          </el-space>
          <div v-if="connectionResult" class="result">
            <h5>连接测试结果：</h5>
            <pre>{{ JSON.stringify(connectionResult, null, 2) }}</pre>
          </div>
        </el-card>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import { rbacApi } from '@/api/rbac'
import request from '@/api/request'

// 状态管理
const testingLogin = ref(false)
const testingPermissions = ref(false)
const testingRoles = ref(false)
const testingCreateRole = ref(false)
const testingMenuTree = ref(false)
const testingCreateMenu = ref(false)
const testingCheckPermission = ref(false)
const testingConnection = ref(false)

// 表单数据
const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
})

const permissionIdentifier = ref('user:add')
const connectionStatus = ref<'success' | 'error'>('error')

// 结果数据
const loginResult = ref<any>(null)
const permissionsResult = ref<any>(null)
const rolesResult = ref<any>(null)
const menuTreeResult = ref<any>(null)
const checkPermissionResult = ref<any>(null)
const connectionResult = ref<any>(null)

// 测试JWT登录
const testJWTLogin = async () => {
  testingLogin.value = true
  try {
    const response = await authApi.jwtLogin(loginForm)
    loginResult.value = response
    ElMessage.success('JWT登录测试成功')
  } catch (error: any) {
    loginResult.value = { error: error.message || '登录失败' }
    ElMessage.error('JWT登录测试失败')
  } finally {
    testingLogin.value = false
  }
}

// 测试获取用户权限
const testGetPermissions = async () => {
  testingPermissions.value = true
  try {
    const response = await rbacApi.getMyPermissions()
    permissionsResult.value = response
    ElMessage.success('获取用户权限测试成功')
  } catch (error: any) {
    permissionsResult.value = { error: error.message || '获取权限失败' }
    ElMessage.error('获取用户权限测试失败')
  } finally {
    testingPermissions.value = false
  }
}

// 测试获取角色列表
const testGetRoles = async () => {
  testingRoles.value = true
  try {
    const response = await rbacApi.getRoles(1, 10)
    rolesResult.value = response
    ElMessage.success('获取角色列表测试成功')
  } catch (error: any) {
    rolesResult.value = { error: error.message || '获取角色失败' }
    ElMessage.error('获取角色列表测试失败')
  } finally {
    testingRoles.value = false
  }
}

// 测试创建角色
const testCreateRole = async () => {
  testingCreateRole.value = true
  try {
    const response = await rbacApi.createRole({
      role_name: '测试角色_' + Date.now(),
      desc: '这是一个API测试创建的角色'
    })
    rolesResult.value = response
    ElMessage.success('创建角色测试成功')
  } catch (error: any) {
    rolesResult.value = { error: error.message || '创建角色失败' }
    ElMessage.error('创建角色测试失败')
  } finally {
    testingCreateRole.value = false
  }
}

// 测试获取菜单树
const testGetMenuTree = async () => {
  testingMenuTree.value = true
  try {
    const response = await rbacApi.getMenuTree()
    menuTreeResult.value = response
    ElMessage.success('获取菜单树测试成功')
  } catch (error: any) {
    menuTreeResult.value = { error: error.message || '获取菜单树失败' }
    ElMessage.error('获取菜单树测试失败')
  } finally {
    testingMenuTree.value = false
  }
}

// 测试创建菜单
const testCreateMenu = async () => {
  testingCreateMenu.value = true
  try {
    const response = await rbacApi.createMenu({
      name: '测试菜单_' + Date.now(),
      type: 1,
      path: '/test-menu',
      component: 'TestMenu',
      pid: 0,
      identifier: 'test:menu'
    })
    menuTreeResult.value = response
    ElMessage.success('创建菜单测试成功')
  } catch (error: any) {
    menuTreeResult.value = { error: error.message || '创建菜单失败' }
    ElMessage.error('创建菜单测试失败')
  } finally {
    testingCreateMenu.value = false
  }
}

// 测试权限检查
const testCheckPermission = async () => {
  if (!permissionIdentifier.value) {
    ElMessage.warning('请输入权限标识')
    return
  }
  
  testingCheckPermission.value = true
  try {
    const response = await rbacApi.checkPermission(permissionIdentifier.value)
    checkPermissionResult.value = response
    ElMessage.success('权限检查测试成功')
  } catch (error: any) {
    checkPermissionResult.value = { error: error.message || '权限检查失败' }
    ElMessage.error('权限检查测试失败')
  } finally {
    testingCheckPermission.value = false
  }
}

// 测试后端连接
const testConnection = async () => {
  testingConnection.value = true
  try {
    // 尝试访问一个简单的端点
    const response = await request.get('/health', { timeout: 5000 })
    connectionResult.value = response
    connectionStatus.value = 'success'
    ElMessage.success('后端连接正常')
  } catch (error: any) {
    connectionResult.value = { 
      error: error.message || '连接失败',
      details: error.response?.data || '无响应数据'
    }
    connectionStatus.value = 'error'
    ElMessage.error('后端连接失败')
  } finally {
    testingConnection.value = false
  }
}
</script>

<style scoped>
.test-api-container {
  padding: 20px;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.result h5 {
  margin: 0 0 10px 0;
  color: #666;
}

.result pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  font-size: 12px;
}
</style>



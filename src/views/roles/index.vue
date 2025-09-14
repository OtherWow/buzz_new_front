<template>
  <div class="roles-container">
    <div class="header">
      <h2>角色管理</h2>
      <el-button 
        type="primary" 
        @click="createRole"
        v-permission="'role:add'"
      >
        <el-icon><Plus /></el-icon>
        新建角色
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="角色名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadRoles">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table 
      :data="roleList" 
      v-loading="loading"
      style="width: 100%"
      stripe
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="role_name" label="角色名称" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" width="180" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            link 
            @click="viewRole(row)"
            v-permission="'role:view'"
          >
            查看
          </el-button>
          <el-button 
            type="primary" 
            link 
            @click="editRole(row)"
            v-permission="'role:edit'"
          >
            编辑
          </el-button>
          <el-button 
            type="primary" 
            link 
            @click="managePermissions(row)"
            v-permission="'role:assign_permission'"
          >
            权限配置
          </el-button>
          <el-button 
            type="danger" 
            link 
            @click="deleteRole(row)"
            v-permission="'role:delete'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadRoles"
        @current-change="loadRoles"
      />
    </div>

    <!-- 创建/编辑角色对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="showCreateDialog"
      width="500px"
    >
      <el-form 
        ref="roleFormRef"
        :model="roleForm" 
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="roleForm.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input 
            v-model="roleForm.desc" 
            type="textarea" 
            placeholder="请输入角色描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRole" :loading="saving">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog 
      title="权限配置" 
      v-model="showPermissionDialog"
      width="600px"
    >
      <div v-loading="permissionLoading">
        <el-tree
          ref="permissionTreeRef"
          :data="menuTree"
          node-key="id"
          show-checkbox
          :check-strictly="false"
          :default-checked-keys="selectedPermissions"
          :props="{ label: 'name', children: 'children' }"
        />
      </div>
      <template #footer>
        <el-button @click="showPermissionDialog = false">取消</el-button>
        <el-button type="primary" @click="savePermissions" :loading="saving">
          保存权限
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTree, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { rbacApi, type Role, type RoleCreateRequest, type Menu } from '@/api/rbac'

// 状态管理
const loading = ref(false)
const saving = ref(false)
const permissionLoading = ref(false)
const showCreateDialog = ref(false)
const showPermissionDialog = ref(false)
const isEdit = ref(false)
const currentRole = ref<Role | null>(null)

// 表格数据
const roleList = ref<Role[]>([])
const menuTree = ref<Menu[]>([])
const selectedPermissions = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as number | undefined
})

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 角色表单
const roleForm = reactive<RoleCreateRequest & { status?: number }>({
  role_name: '',
  desc: '',
  status: 1
})

// 表单引用
const roleFormRef = ref<FormInstance>()
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()

// 表单验证规则
const roleRules = {
  role_name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 1, max: 10, message: '角色名称长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  desc: [
    { max: 60, message: '描述长度不能超过 60 个字符', trigger: 'blur' }
  ]
}

// 计算属性
const dialogTitle = computed(() => isEdit.value ? '编辑角色' : '新建角色')

// 加载角色列表
const loadRoles = async () => {
  loading.value = true
  try {
    const response = await rbacApi.getRoles(
      pagination.page,
      pagination.size,
      searchForm.name || undefined,
      searchForm.status
    )
    roleList.value = response.data.data.items
    pagination.total = response.data.data.total
  } catch (error) {
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = undefined
  pagination.page = 1
  loadRoles()
}

// 查看角色
const viewRole = (role: Role) => {
  ElMessage.info(`查看角色: ${role.role_name}`)
  // TODO: 实现角色详情查看
}

// 编辑角色
const editRole = (role: Role) => {
  isEdit.value = true
  currentRole.value = role
  roleForm.role_name = role.role_name
  roleForm.desc = role.desc || ''
  roleForm.status = role.status
  showCreateDialog.value = true
}

// 删除角色
const deleteRole = async (role: Role) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${role.role_name}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    
    await rbacApi.deleteRole(role.id)
    ElMessage.success('删除成功')
    loadRoles()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存角色
const saveRole = async () => {
  if (!roleFormRef.value) return
  
  try {
    await roleFormRef.value.validate()
    saving.value = true
    
    if (isEdit.value && currentRole.value) {
      await rbacApi.updateRole(currentRole.value.id, roleForm)
      ElMessage.success('更新成功')
    } else {
      await rbacApi.createRole(roleForm)
      ElMessage.success('创建成功')
    }
    
    showCreateDialog.value = false
    resetRoleForm()
    loadRoles()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    saving.value = false
  }
}

// 重置角色表单
const resetRoleForm = () => {
  roleForm.role_name = ''
  roleForm.desc = ''
  roleForm.status = 1
  isEdit.value = false
  currentRole.value = null
  roleFormRef.value?.resetFields()
}

// 权限配置
const managePermissions = async (role: Role) => {
  currentRole.value = role
  permissionLoading.value = true
  showPermissionDialog.value = true
  
  try {
    // 加载菜单树
    const menuResponse = await rbacApi.getMenuTree()
    menuTree.value = menuResponse.data.data
    
    // 加载角色已有权限
    const permissionResponse = await rbacApi.getRolePermissions(role.id)
    selectedPermissions.value = permissionResponse.data.data.map(p => p.id)
  } catch (error) {
    ElMessage.error('加载权限数据失败')
  } finally {
    permissionLoading.value = false
  }
}

// 保存权限配置
const savePermissions = async () => {
  if (!currentRole.value || !permissionTreeRef.value) return
  
  saving.value = true
  try {
    const checkedKeys = permissionTreeRef.value.getCheckedKeys(false) as number[]
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys() as number[]
    const allSelectedKeys = [...checkedKeys, ...halfCheckedKeys]
    
    await rbacApi.assignRolePermissions({
      role_id: currentRole.value.id,
      menu_ids: allSelectedKeys
    })
    
    ElMessage.success('权限配置保存成功')
    showPermissionDialog.value = false
  } catch (error) {
    ElMessage.error('权限配置保存失败')
  } finally {
    saving.value = false
  }
}

// 新建角色
const createRole = () => {
  resetRoleForm()
  showCreateDialog.value = true
}

// 初始化
onMounted(() => {
  loadRoles()
})
</script> 

<style scoped>
.roles-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
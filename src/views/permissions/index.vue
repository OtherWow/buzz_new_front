<template>
  <div class="permissions-container">
    <div class="header">
      <h2>权限管理</h2>
      <el-button 
        type="primary" 
        @click="createMenu"
        v-permission="'menu:add'"
      >
        <el-icon><Plus /></el-icon>
        新建菜单
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="菜单名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入菜单名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="请选择类型"
            clearable
            style="width: 120px"
          >
            <el-option label="菜单" :value="1" />
            <el-option label="按钮" :value="2" />
            <el-option label="接口" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadMenus">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="toggleTreeView">
            {{ isTreeView ? '列表视图' : '树形视图' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 树形视图 -->
    <div v-if="isTreeView" class="tree-view">
      <el-tree
        :data="menuTree"
        node-key="id"
        :expand-on-click-node="false"
        :props="{ label: 'name', children: 'children' }"
        class="menu-tree"
      >
        <template #default="{ data }">
          <div class="tree-node">
            <div class="node-content">
              <el-icon v-if="data.icon" class="node-icon">
                <component :is="data.icon" />
              </el-icon>
              <span class="node-name">{{ data.name }}</span>
              <el-tag 
                :type="getTypeTagType(data.type)" 
                size="small"
                class="node-type"
              >
                {{ getTypeText(data.type) }}
              </el-tag>
              <span v-if="data.identifier" class="node-identifier">
                {{ data.identifier }}
              </span>
            </div>
            <div class="node-actions">
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="editMenu(data)"
                v-permission="'menu:edit'"
              >
                编辑
              </el-button>
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="addChild(data)"
                v-permission="'menu:add'"
              >
                添加子项
              </el-button>
              <el-button 
                type="danger" 
                link 
                size="small"
                @click="deleteMenu(data)"
                v-permission="'menu:delete'"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 表格视图 -->
    <el-table 
      v-else
      :data="menuList" 
      v-loading="loading"
      style="width: 100%"
      stripe
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" width="200" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getTypeTagType(row.type)" size="small">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="component" label="组件" />
      <el-table-column prop="identifier" label="权限标识" />
      <el-table-column prop="api" label="API地址" />
      <el-table-column prop="method" label="方法" width="80" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            link 
            @click="editMenu(row)"
            v-permission="'menu:edit'"
          >
            编辑
          </el-button>
          <el-button 
            type="primary" 
            link 
            @click="addChild(row)"
            v-permission="'menu:add'"
          >
            添加子项
          </el-button>
          <el-button 
            type="danger" 
            link 
            @click="deleteMenu(row)"
            v-permission="'menu:delete'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑菜单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="showCreateDialog"
      width="700px"
    >
      <el-form 
        ref="menuFormRef"
        :model="menuForm" 
        :rules="menuRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menuForm.type">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
                <el-radio :label="3">接口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="父级菜单" prop="pid">
              <el-tree-select
                v-model="menuForm.pid"
                :data="parentMenuOptions"
                :render-after-expand="false"
                node-key="id"
                :props="{ label: 'name', children: 'children' }"
                placeholder="请选择父级菜单"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon" v-if="menuForm.type === 1">
              <el-input v-model="menuForm.icon" placeholder="请输入图标名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="menuForm.type === 1">
          <el-col :span="12">
            <el-form-item label="路由路径" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="menuForm.type === 3">
          <el-col :span="12">
            <el-form-item label="API地址" prop="api">
              <el-input v-model="menuForm.api" placeholder="请输入API地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="HTTP方法" prop="method">
              <el-select v-model="menuForm.method" placeholder="请选择HTTP方法">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
                <el-option label="PATCH" value="PATCH" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="权限标识" prop="identifier">
          <el-input 
            v-model="menuForm.identifier" 
            placeholder="请输入权限标识，如：user:add"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMenu" :loading="saving">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTreeSelect, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { rbacApi, type Menu, type MenuCreateRequest } from '@/api/rbac'

// 状态管理
const loading = ref(false)
const saving = ref(false)
const showCreateDialog = ref(false)
const isEdit = ref(false)
const isTreeView = ref(true)
const currentMenu = ref<Menu | null>(null)

// 数据
const menuList = ref<Menu[]>([])
const menuTree = ref<Menu[]>([])
const parentMenuOptions = ref<Menu[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: undefined as number | undefined
})

// 菜单表单
const menuForm = reactive<MenuCreateRequest>({
  name: '',
  type: 1,
  icon: '',
  path: '',
  component: '',
  pid: 0,
  identifier: '',
  api: '',
  method: ''
})

// 表单引用
const menuFormRef = ref<FormInstance>()

// 表单验证规则
const menuRules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  path: [
    { 
      validator: (_rule: any, value: string, callback: Function) => {
        if (menuForm.type === 1 && !value) {
          callback(new Error('菜单类型必须输入路由路径'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  api: [
    { 
      validator: (_rule: any, value: string, callback: Function) => {
        if (menuForm.type === 3 && !value) {
          callback(new Error('接口类型必须输入API地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  method: [
    { 
      validator: (_rule: any, value: string, callback: Function) => {
        if (menuForm.type === 3 && !value) {
          callback(new Error('接口类型必须选择HTTP方法'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 计算属性
const dialogTitle = computed(() => isEdit.value ? '编辑菜单' : '新建菜单')

// 获取类型文本
const getTypeText = (type: number) => {
  const typeMap = { 1: '菜单', 2: '按钮', 3: '接口' }
  return typeMap[type as keyof typeof typeMap] || '未知'
}

// 获取类型标签颜色
const getTypeTagType = (type: number) => {
  const typeMap = { 1: 'primary', 2: 'success', 3: 'warning' }
  return typeMap[type as keyof typeof typeMap] || 'info'
}

// 加载菜单数据
const loadMenus = async () => {
  loading.value = true
  try {
    if (isTreeView.value) {
      const response = await rbacApi.getMenuTree()
      menuTree.value = response.data.data
    } else {
      const response = await rbacApi.getMenus(
        1, 1000, // 获取所有数据
        searchForm.name || undefined,
        searchForm.type
      )
      menuList.value = response.data.data.items
    }
  } catch (error) {
    ElMessage.error('加载菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 加载父菜单选项
const loadParentOptions = async () => {
  try {
    const response = await rbacApi.getMenuTree()
    // 过滤掉按钮和接口类型，只保留菜单类型作为父菜单选项
    const filterMenus = (menus: Menu[]): Menu[] => {
      return menus
        .filter(menu => menu.type === 1) // 只保留菜单类型
        .map(menu => ({
          ...menu,
          children: menu.children ? filterMenus(menu.children) : []
        }))
    }
    parentMenuOptions.value = filterMenus(response.data.data)
  } catch (error) {
    ElMessage.error('加载父菜单选项失败')
  }
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = undefined
  loadMenus()
}

// 切换视图模式
const toggleTreeView = () => {
  isTreeView.value = !isTreeView.value
  loadMenus()
}

// 新建菜单
const createMenu = () => {
  resetMenuForm()
  showCreateDialog.value = true
  loadParentOptions()
}

// 编辑菜单
const editMenu = (menu: Menu) => {
  isEdit.value = true
  currentMenu.value = menu
  menuForm.name = menu.name
  menuForm.type = menu.type
  menuForm.icon = menu.icon || ''
  menuForm.path = menu.path || ''
  menuForm.component = menu.component || ''
  menuForm.pid = menu.pid
  menuForm.identifier = menu.identifier || ''
  menuForm.api = menu.api || ''
  menuForm.method = menu.method || ''
  showCreateDialog.value = true
  loadParentOptions()
}

// 添加子菜单
const addChild = (parentMenu: Menu) => {
  resetMenuForm()
  menuForm.pid = parentMenu.id
  showCreateDialog.value = true
  loadParentOptions()
}

// 删除菜单
const deleteMenu = async (menu: Menu) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${menu.name}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    
    await rbacApi.deleteMenu(menu.id)
    ElMessage.success('删除成功')
    loadMenus()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存菜单
const saveMenu = async () => {
  if (!menuFormRef.value) return
  
  try {
    await menuFormRef.value.validate()
    saving.value = true
    
    if (isEdit.value && currentMenu.value) {
      await rbacApi.updateMenu(currentMenu.value.id, menuForm)
      ElMessage.success('更新成功')
    } else {
      await rbacApi.createMenu(menuForm)
      ElMessage.success('创建成功')
    }
    
    showCreateDialog.value = false
    resetMenuForm()
    loadMenus()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    saving.value = false
  }
}

// 重置菜单表单
const resetMenuForm = () => {
  menuForm.name = ''
  menuForm.type = 1
  menuForm.icon = ''
  menuForm.path = ''
  menuForm.component = ''
  menuForm.pid = 0
  menuForm.identifier = ''
  menuForm.api = ''
  menuForm.method = ''
  isEdit.value = false
  currentMenu.value = null
  menuFormRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  loadMenus()
})
</script> 

<style scoped>
.permissions-container {
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

.tree-view {
  background: white;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 20px;
}

.menu-tree {
  width: 100%;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
}

.node-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.node-icon {
  margin-right: 8px;
  color: #409eff;
}

.node-name {
  font-weight: 500;
  margin-right: 10px;
}

.node-type {
  margin-right: 10px;
}

.node-identifier {
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.node-actions {
  display: flex;
  gap: 5px;
}
</style>
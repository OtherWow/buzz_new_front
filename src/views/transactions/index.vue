<template>
  <div class="transactions-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>交易管理</h3>
          <el-button
            v-if="hasPermission('transaction:create')"
            type="primary"
            @click="handleCreate"
          >
            <el-icon><Plus /></el-icon>
            创建交易
          </el-button>
        </div>
      </template>
      
      <!-- 搜索条件 -->
      <div class="search-form">
        <el-form :model="searchForm" inline>
          <el-form-item label="交易类型">
            <el-select v-model="searchForm.type" placeholder="请选择" clearable>
              <el-option label="买入" value="buy" />
              <el-option label="卖出" value="sell" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable>
              <el-option label="待处理" value="pending" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
              <el-option label="失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 数据表格 -->
      <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column prop="transaction_no" label="交易号" width="200" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'buy' ? 'success' : 'warning'">
              {{ row.type === 'buy' ? '买入' : '卖出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="unit_price" label="单价" width="120">
          <template #default="{ row }">
            ¥{{ row.unit_price.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.total_amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="hasPermission('transaction:update')"
              size="small"
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="hasPermission('transaction:delete')"
              size="small"
              type="danger"
              @click="handleDelete(row)"
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
          :small="false"
          :disabled="loading"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { Transaction } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const hasPermission = (permission: string) => authStore.hasPermission(permission)

const loading = ref(false)
const tableData = ref<Transaction[]>([])

const searchForm = reactive({
  type: '',
  status: '',
  dateRange: [] as Date[]
})

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 模拟数据
const mockData: Transaction[] = [
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
  },
  {
    id: 3,
    transaction_no: 'TXN20240101003',
    type: 'buy',
    product_name: '阿里巴巴股票',
    quantity: 200,
    unit_price: 80,
    total_amount: 16000,
    status: 'failed',
    user_id: 1,
    created_at: '2024-01-01 12:00:00',
    updated_at: '2024-01-01 12:00:00'
  }
]

const fetchData = async () => {
  loading.value = true
  try {
    // 这里应该调用真实的API
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleCreate = () => {
  router.push('/transactions/create')
}

const handleView = (row: Transaction) => {
  router.push(`/transactions/${row.id}`)
}

const handleEdit = (row: Transaction) => {
  router.push(`/transactions/${row.id}/edit`)
}

const handleDelete = async (row: Transaction) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除交易 ${row.transaction_no} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 这里应该调用删除API
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消操作
  }
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
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
  fetchData()
})
</script>

<style lang="scss" scoped>
.transactions-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }
  
  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 6px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style> 
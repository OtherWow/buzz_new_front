<template>
  <div class="create-transaction-page">
    <el-card>
      <template #header>
        <h3>创建交易</h3>
      </template>
      <el-empty description="创建交易功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">返回列表</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 创建交易页面占位符
</script> 
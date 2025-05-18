<template>
  <el-container direction="vertical" class="h-100vh">
    <el-header height="80px">
      <h1>我的应用</h1>
    </el-header>
    <el-main>
      <div>主要内容区域</div>
    </el-main>
    <el-footer height="40px">
      <div>© 2025 我的应用</div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus'
import 'element-plus/dist/index.css'
</script>

<style>
.h-100vh {
  height: 100vh;
}
</style>
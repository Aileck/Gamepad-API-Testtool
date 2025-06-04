<template>
  <el-dialog
    :title="$t('window_close_confirm_title')"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    width="400px"
    class="close-confirm-modal"
    @close="handleCancel"
  >
    <div class="modal-content">
      <span>{{ $t('window_close_confirm_message') }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="small"
          @click="handleMinimize"
        >
          {{ $t('window_close_confirm_minimize') }}
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleClose"
        >
          {{ $t('window_close_confirm_exit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElDialog, ElButton } from 'element-plus'

const visible = ref(false)

const handleCancel = () => {
  visible.value = false
}

const handleMinimize = () => {
  console.log('Minimize clicked')
  visible.value = false
  window.api.minimizeWindow()
}

const handleClose = () => {
  console.log('Close clicked')
  visible.value = false
  window.api.confirmWindowClose(true)
}

const show = () => {
  console.log('Show modal called')
  visible.value = true
}

defineExpose({
  show
})
</script>

<style scoped>
.close-confirm-modal :deep(.el-dialog) {
  border-radius: 8px;
}

.close-confirm-modal :deep(.el-dialog__header) {
  margin-right: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #dcdfe6;
}

.modal-content {
  padding: 20px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-footer .el-button {
  min-width: 80px;
  font-size: 13px;
}
</style> 
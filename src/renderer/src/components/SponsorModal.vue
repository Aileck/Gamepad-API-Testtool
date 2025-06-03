<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message, Star } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElImage, ElButton } from 'element-plus'
import 'element-plus/dist/index.css'

const { t } = useI18n()
const dialogVisible = ref(false)

const openAlipay = () => {
  // 这里添加打开支付宝的逻辑
  window.open('支付宝链接')
}

defineExpose({
  showDialog: () => {
    dialogVisible.value = true
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('sponsor_title')"
    width="800px"
    :modal-class="'sponsor-dialog'"
    align-center
    destroy-on-close
  >
    <div class="sponsor-layout">
      <!-- 左侧边栏 -->
      <div class="sponsor-sidebar">
        <div class="sidebar-section support-methods">
          <h3>{{ t('sponsor_support_title') }}</h3>
          <div class="support-buttons">
            <el-button 
              type="primary" 
              class="support-button"
              @click="openAlipay"
            >
              {{ t('sponsor_button_text') }}
            </el-button>
            <div class="qr-wrapper">
              <el-image 
                :src="t('sponsor_wechat_qr')" 
                fit="contain"
                :preview-src-list="[t('sponsor_wechat_qr')]"
              >
                <template #placeholder>
                  <div class="image-placeholder">Loading...</div>
                </template>
              </el-image>
              <div class="qr-label">{{ t('sponsor_wechat') }}</div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section contact-info">
          <h3>{{ t('sponsor_contact_title') }}</h3>
          <div class="contact-links" v-html="t('sponsor_contact_content')"></div>
        </div>
      </div>

      <!-- 右侧主内容 -->
      <div class="sponsor-main">
        <div class="main-content" v-html="t('sponsor_main_content')"></div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.sponsor-layout {
  display: flex;
  gap: 30px;
  min-height: 400px;
}

.sponsor-sidebar {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--el-border-color-lighter);
  padding-right: 20px;
}

.sponsor-main {
  flex: 1;
  padding-left: 10px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.support-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.support-button {
  width: 160px;
  height: 45px;
  font-size: 16px;
}

.qr-wrapper {
  text-align: center;
}

.el-image {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.qr-label {
  margin-top: 8px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.contact-links :deep(a) {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
  text-decoration: none;
  margin: 12px 0;
  font-size: 14px;
}

.contact-links :deep(a:hover) {
  text-decoration: underline;
}

.main-content {
  color: var(--el-text-color-regular);
  font-size: 15px;
  line-height: 1.8;
}

.main-content :deep(p) {
  margin: 16px 0;
}

.main-content :deep(ul) {
  margin: 16px 0;
  padding-left: 0;
  list-style: none;
}

.main-content :deep(li) {
  position: relative;
  margin: 12px 0;
  padding-left: 20px;
}

.main-content :deep(li::before) {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--el-color-primary);
}

.main-content :deep(strong) {
  color: var(--el-color-primary);
  font-weight: 600;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 0;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sponsor-layout {
    flex-direction: column;
  }

  .sponsor-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-lighter);
    padding-right: 0;
    padding-bottom: 20px;
  }

  .sponsor-main {
    padding-left: 0;
  }
}
</style> 
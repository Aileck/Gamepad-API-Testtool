<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download } from '@element-plus/icons-vue'
import { ElDialog, ElButton, ElIcon, ElDivider, ElLink, ElText } from 'element-plus'
import 'element-plus/dist/index.css'

const { t, locale } = useI18n()
const dialogVisible = ref(false)

const isChineseLocale = computed(() => locale.value === 'zh')

const openLink = (url: string) => {
  window.open(url, '_blank')
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
    :title="t('download_title')"
    width="400px"
    align-center
    destroy-on-close
  >
    <div class="download-content">
      <div class="download-section">
        <h3>{{ t('download_mobile_title') }}</h3>
        <p class="description">{{ t('download_mobile_description') }}</p>
        <div class="button-group">
          <template v-if="isChineseLocale">
            <el-button 
              type="warning" 
              class="download-button"
              @click="openLink('你的百度网盘链接')"
            >
              <el-icon><Download /></el-icon>
              {{ t('download_on_baidu') }}
            </el-button>
          </template>
          <el-button 
            type="primary" 
            class="download-button"
            @click="openLink('https://aileck.itch.io/phonepad-web')"
          >
            <el-icon><Download /></el-icon>
            {{ t('download_on_itch_io') }}
          </el-button>
        </div>
      </div>
      
      <el-divider />
      
      <div class="download-section">
        <h3>{{ t('download_vigem_title') }}</h3>
        <p class="description">{{ t('download_vigem_description') }}</p>
        <div class="button-group">
          <template v-if="isChineseLocale">
            <el-button 
              type="warning" 
              class="download-button"
              @click="openLink('你的百度网盘链接')"
            >
              <el-icon><Download /></el-icon>
              {{ t('download_on_baidu') }}
            </el-button>
          </template>
          <el-button 
            type="primary" 
            class="download-button"
            @click="openLink('https://github.com/nefarius/ViGEmBus/releases/download/v1.22.0/ViGEmBus_1.22.0_x64_x86_arm64.exe')"
          >
            <el-icon><Download /></el-icon>
            {{ t('download_on_github') }}
          </el-button>
        </div>
      </div>

      <div v-if="isChineseLocale" class="contact-info">
        <el-text class="text-small" type="info">
          {{ t('download_contact_info') }}
          <el-link 
            href="https://space.bilibili.com/2459782" 
            target="_blank"
            type="primary"
          >
            Bilibili
          </el-link>
        </el-text>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.download-content {
  padding: 20px 10px;
}

.download-section {
  margin-bottom: 20px;
  text-align: center;
}

.download-section:last-child {
  margin-bottom: 0;
}

.download-section h3 {
  margin-bottom: 12px;
  color: var(--el-color-primary);
  font-size: 18px;
}

.description {
  margin-bottom: 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.download-button {
  width: 200px;
}

.download-button .el-icon {
  margin-right: 8px;
}

.contact-info {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
  padding-bottom: 20px;
}

:deep(.el-divider--horizontal) {
  margin: 24px 0;
}
</style> 
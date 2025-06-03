<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElDialog, ElScrollbar, ElDivider, ElIcon } from 'element-plus'
import 'element-plus/dist/index.css'

const { t } = useI18n()
const dialogVisible = ref(false)

defineExpose({
  showDialog: () => {
    dialogVisible.value = true
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('help_title')"
    width="500px"
    align-center
    destroy-on-close
  >
    <el-scrollbar height="400px">
      <div class="help-content">
        <section class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_1_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_1_content')"></div>
        </section>

        <el-divider />

        <section class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_2_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_2_content')"></div>
        </section>

        <el-divider />

        <section class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_3_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_3_content')"></div>
        </section>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped>
.help-content {
  padding: 0 10px;
}

.help-section {
  margin: 20px 0;
}

.help-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
  font-size: 18px;
  margin-bottom: 16px;
}

.help-text {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
}

.help-text :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-scrollbar__view) {
  padding: 20px 0;
}

:deep(.el-divider--horizontal) {
  margin: 24px 0;
}
</style> 
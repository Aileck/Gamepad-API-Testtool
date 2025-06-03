<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document } from '@element-plus/icons-vue'
import { ElDialog, ElButton, ElIcon } from 'element-plus'
import 'element-plus/dist/index.css'

const { t, locale } = useI18n()
const dialogVisible = ref(false)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' }
]

const selectLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('preferred_language', lang)
  dialogVisible.value = false
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
    :title="t('language_modal_title')"
    width="300px"
    align-center
    destroy-on-close
  >
    <div class="language-options">
      <el-button
        v-for="lang in languages"
        :key="lang.code"
        type="primary"
        plain
        align-center
        @click="selectLanguage(lang.code)"
      >
        <el-icon class="language-icon"><Document /></el-icon>
        {{ t(`language_modal_${lang.code}`) }}
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.language-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.language-options .el-button {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.language-icon {
  margin-right: 4px;
}

.language-options .el-button.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
</style> 
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { QuestionFilled, VideoCamera, Monitor } from '@element-plus/icons-vue'
import { ElDialog, ElScrollbar, ElDivider, ElIcon, ElAlert, ElButton, ElRadioGroup, ElRadio, ElAffix } from 'element-plus'
import 'element-plus/dist/index.css'

declare global {
  interface Window {
    showDownload: () => void;
  }
}

const { t } = useI18n()
const dialogVisible = ref(false)
const currentLayout = ref<'xbox' | 'dualshock'>('xbox')
const activeSection = ref('section1')

interface ButtonState {
  isActive: boolean;
  mode: 'default' | 'swipe' | 'toggle';
}

// Button states for both layouts
const buttonStates = ref<Record<string, ButtonState>>({
  A: { isActive: false, mode: 'default' },
  B: { isActive: false, mode: 'default' },
  X: { isActive: false, mode: 'default' },
  Y: { isActive: false, mode: 'default' }
})

const buttonConfig = {
  xbox: {
    A: { label: 'A' },
    B: { label: 'B' },
    X: { label: 'X' },
    Y: { label: 'Y' }
  },
  dualshock: {
    A: { label: '×' },
    B: { label: '○' },
    X: { label: '□' },
    Y: { label: '△' }
  }
}

const setButtonMode = (button: string, mode: 'default' | 'swipe' | 'toggle') => {
  buttonStates.value[button].mode = mode
}

const handleButtonAction = (button: string) => {
  const state = buttonStates.value[button]
  
  if (state.mode === 'swipe') {
    state.isActive = true
    setTimeout(() => {
      state.isActive = false
    }, 500)
  } else if (state.mode === 'toggle') {
    state.isActive = !state.isActive
  } else {
    state.isActive = true
    setTimeout(() => {
      state.isActive = false
    }, 200)
  }
}

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const emit = defineEmits(['show-download'])

const showDownload = () => {
  emit('show-download')
}

window.showDownload = showDownload

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
    width="1000px"
    align-center
    destroy-on-close
  >
    <div class="help-container">
      <el-affix :offset="20" class="nav-sidebar">
        <div class="nav-menu">
          <div
            v-for="section in ['section1', 'section3', 'section4', 'section2']"
            :key="section"
            class="nav-item"
            :class="{ active: activeSection === section }"
            @click="scrollToSection(section)"
          >
            {{ t(`help_section_${section === 'section4' ? '4' : section === 'section3' ? '3' : section === 'section2' ? '2' : '1'}_title`) }}
          </div>
        </div>
      </el-affix>

      <el-scrollbar height="500px" class="help-content">
        <el-alert
          :title="t('help_warning')"
          type="warning"
          :closable="false"
          class="preview-warning"
        />

        <!-- Getting Started -->
        <div class="main-content" v-html="t('help_section_main_description')"></div>
        <section id="section1" class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_1_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_1_content')"></div>
          <div class="action-buttons">
            <a :href="t('help_video_url')" target="_blank" class="video-link">
              <el-icon><VideoCamera /></el-icon>
              {{ t('help_video_text') }}
            </a>
          </div>
        </section>

        <el-divider />

        <!-- Main Features -->
        <section id="section3" class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_3_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_3_content')"></div>
        </section>

        <el-divider />

        <!-- Controller Customization -->
        <section id="section4" class="help-section">
          <h3>
            <el-icon><Monitor /></el-icon>
            {{ t('controller_customization') }}
          </h3>
          <div class="help-text">
            <p class="customization-desc">{{ t('controller_customization_desc') }}</p>
            
            <div class="layout-switcher">
              <el-radio-group v-model="currentLayout" size="large">
                <el-radio label="xbox">{{ t('xbox_layout') }}</el-radio>
                <el-radio label="dualshock">{{ t('dualshock_layout') }}</el-radio>
              </el-radio-group>
            </div>
            
            <div class="controller-settings">
              <div class="buttons-grid">
                <div v-for="button in ['A', 'B', 'X', 'Y']" :key="button" class="button-config">
                  <div class="button-with-status">
                    <el-button
                      type="primary"
                      class="xbox-button"
                      :class="[
                        { 'button-active': buttonStates[button].isActive },
                        { 'dualshock-button': currentLayout === 'dualshock' }
                      ]"
                      @click="handleButtonAction(button)"
                      @mouseenter="buttonStates[button].mode === 'swipe' ? handleButtonAction(button) : null"
                      round
                    >
                      {{ buttonConfig[currentLayout][button].label }}
                    </el-button>
                    <span v-if="buttonStates[button].isActive" class="button-status status-active">
                      {{ t('button_pressed') }}
                    </span>
                  </div>
                  
                  <div class="mode-buttons">
                    <el-button
                      :type="buttonStates[button].mode === 'default' ? 'primary' : 'default'"
                      @click="setButtonMode(button, 'default')"
                      size="small"
                    >
                      {{ t('mode_default') }}
                    </el-button>
                    <el-button
                      :type="buttonStates[button].mode === 'swipe' ? 'primary' : 'default'"
                      @click="setButtonMode(button, 'swipe')"
                      size="small"
                    >
                      {{ t('mode_swipe') }}
                    </el-button>
                    <el-button
                      :type="buttonStates[button].mode === 'toggle' ? 'primary' : 'default'"
                      @click="setButtonMode(button, 'toggle')"
                      size="small"
                    >
                      {{ t('mode_toggle') }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <el-divider />

        <!-- Troubleshooting -->
        <section id="section2" class="help-section">
          <h3>
            <el-icon><QuestionFilled /></el-icon>
            {{ t('help_section_2_title') }}
          </h3>
          <div class="help-text" v-html="t('help_section_2_content')"></div>
        </section>
      </el-scrollbar>
    </div>
    <div class="help-disclaimer">
      {{ t('help_disclaimer') }}
    </div>
  </el-dialog>
</template>

<style scoped>
.help-container {
  display: flex;
  gap: 32px;
}

.nav-sidebar {
  width: 180px;
  flex-shrink: 0;
}

.nav-menu {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 12px;
}

.nav-item {
  padding: 8px 12px;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.nav-item:hover {
  background-color: var(--el-fill-color);
}

.nav-item.active {
  background-color: var(--el-color-primary);
  color: white;
}

.help-content {
  flex-grow: 1;
  padding: 0 24px;
  width: calc(100% - 180px);
}

.preview-warning {
  margin-bottom: 24px;
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
  font-size: 15px;
  line-height: 1.8;
}

.help-text :deep(ul) {
  margin: 16px 0;
  padding-left: 0;
  list-style: none;
}

.help-text :deep(li) {
  position: relative;
  margin: 12px 0;
  padding-left: 24px;
}

.help-text :deep(li::before) {
  content: "•";
  position: absolute;
  left: 6px;
  top: -1px;
  color: var(--el-color-primary);
  font-size: 18px;
  font-weight: bold;
}

.button-with-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 76px;
}

.button-status {
  font-size: 12px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.xbox-button {
  width: 50px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  padding: 0;
  transition: all 0.2s ease;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.xbox-button.button-active {
  transform: scale(0.95);
  background-color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-dark-2);
  box-shadow: 0 0 12px var(--el-color-primary);
}

.xbox-button.dualshock-button {
  font-family: sans-serif;
  font-size: 24px;
  font-weight: normal;
}

.mode-buttons {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.mode-buttons .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

.controller-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.button-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: var(--el-fill-color);
  border-radius: 8px;
}

.layout-switcher {
  margin-bottom: 20px;
  text-align: center;
}

.action-buttons {
  margin: 20px 0;
  text-align: center;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--el-color-success);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.video-link:hover {
  background-color: var(--el-color-success-dark-2);
}

.video-link .el-icon {
  font-size: 18px;
}

:deep(.el-dialog__body) {
  padding: 20px 0;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 0;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
}

:deep(.el-alert__title) {
  font-size: 14px;
  line-height: 1.6;
}

.customization-desc {
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: var(--el-fill-color);
  border-radius: 4px;
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
}

.help-disclaimer {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-secondary, #888);
}

.main-content {
  font-size: 16px;
  line-height: 1.3;
}
</style> 
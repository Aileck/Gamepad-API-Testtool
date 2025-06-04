<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'

import { ElContainer, ElHeader, ElMain, ElAside, ElSpace, ElButton, ElRow, ElCol, ElIcon, ElScrollbar, ElText } from 'element-plus'
import { InfoFilled, QuestionFilled, Document, Download, Star } from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import QRCode from 'qrcode'

import GamepadBox from './components/GamepadBox.vue';
import LanguageModal from './components/LanguageModal.vue'
import DownloadModal from './components/DownloadModal.vue'
import HelpModal from './components/HelpModal.vue'
import SponsorModal from './components/SponsorModal.vue'
import CloseConfirmModal from './components/CloseConfirmModal.vue'

const sessionIP = ref("No internet connection");
const sessionPort = ref("No internet connection");
const qrCanvas = ref(null)

const maxGamepads = ref(0);
const serverStatus = ref('loading');
const showDownloadButton = ref(false);
const isFirstHelpClick = ref(localStorage.getItem('help_clicked') !== 'true');
const isFirstSponsorClick = ref(localStorage.getItem('sponsor_clicked') !== 'true');

interface GamepadSlot {
  clientId: number;
  gamepadType: string;
}

const gamepadSlots = ref<(GamepadSlot | null)[]>([]);

const languageModalRef = ref()
const downloadModalRef = ref()
const helpModalRef = ref()
const sponsorModalRef = ref()
const closeConfirmModalRef = ref()

const { locale } = useI18n();

// 添加窗口关闭事件监听
window.api.onWindowCloseRequest(() => {
  console.log('Received close request')
  closeConfirmModalRef.value?.show()
})

async function awakeCommunication() {
  await window.api.awake_wss();
}

async function startCommunication() {
  await window.api.start_wss(60001);
  const ipInfo = await window.api.get_server_ip();

  sessionIP.value = ipInfo.ips[0];
  sessionPort.value = ipInfo.port;
}

onMounted(async () => {
  // 先设置事件监听器
  window.api.onServerStatus((_, data) => {
    console.log('Received server status:', data);
    if (data.status === 'error') {
      if (data.error === 'VIGEM_ERROR_BUS_NOT_FOUND') {
        console.log('Setting status to no_vigem');
        serverStatus.value = 'no_vigem';
        showDownloadButton.value = true;
      } else if (data.error === 'NO_NETWORK') {
        console.log('Setting status to no_network');
        serverStatus.value = 'no_network';
      } else {
        console.log('Setting status to unknown_error');
        serverStatus.value = 'unknown_error';
      }
    } else if (data.status === 'started') {
      console.log('Setting status to normal');
      serverStatus.value = 'normal';
      showDownloadButton.value = false;
    }
    console.log('Current serverStatus:', serverStatus.value);
  });

  // 然后再初始化通信
  await awakeCommunication();
  await startCommunication();

  // 添加调试日志
  console.log('Current locale:', locale.value);
  console.log('Saved language:', localStorage.getItem('preferred_language'));
  console.log('Current serverStatus:', serverStatus.value);

  maxGamepads.value = await window.api.getMaxGamepads();
  gamepadSlots.value = Array(maxGamepads.value).fill(null);

  QRCode.toCanvas(qrCanvas.value, 
    `{
      "ip": "${sessionIP.value}",
      "port": "${sessionPort.value}"
    }`, {
    width: 120,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
    }
  )

  window.api.onGamepadRegistered((_, data) => {
    const emptySlotIndex = gamepadSlots.value.findIndex(slot => slot === null);
    
    if (emptySlotIndex !== -1) {
      const newSlots = [...gamepadSlots.value];
      newSlots[emptySlotIndex] = { ...data };
      gamepadSlots.value = newSlots;
    }
  });

  window.api.onGamepadDisconnected((_, data) => {
    const index = gamepadSlots.value.findIndex(slot => slot?.clientId === data.id);
    if (index !== -1) {
      gamepadSlots.value[index] = null;
    }
  });

  // Initialize saved language preference
  const savedLanguage = localStorage.getItem('preferred_language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
});

const handleLanguageClick = () => {
  languageModalRef.value?.showDialog()
}

const handleDownloadClick = () => {
  downloadModalRef.value?.showDialog()
}

const handleHelpClick = () => {
  helpModalRef.value?.showDialog()
  if (isFirstHelpClick.value) {
    localStorage.setItem('help_clicked', 'true')
    isFirstHelpClick.value = false
  }
}

const handleSponsorClick = () => {
  sponsorModalRef.value?.showDialog()
  if (isFirstSponsorClick.value) {
    localStorage.setItem('sponsor_clicked', 'true')
    isFirstSponsorClick.value = false
  }
}
</script>

<template>
  <el-container class="full-page">
    <el-aside class="dark-gray-bg aside-container" width="300px">
      <div class="sidebar-content">
        <div class="qr-code-section">
          <canvas ref="qrCanvas"></canvas>
        </div>
        
        <div class="connection-info">
          <el-space direction="vertical" :size="20" alignment="center">
            <div class="ip-info">
              <span>{{ $t('ip') }}:</span>
              <el-button size="default" type="warning">{{ sessionIP }}</el-button>
            </div>
            <div class="port-info">
              <span>{{ $t('port') }}</span>
              <el-button size="default" type="warning">{{ sessionPort }}</el-button>
            </div>
          </el-space>
        </div>

        <div class="action-buttons">
          <el-row :gutter="10" justify="center">
            <el-col :span="12">
              <el-button size="small" type="info" plain @click="handleLanguageClick">
                <el-icon><Document /></el-icon>
                {{ $t('button_language') }}
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button 
                size="small" 
                :type="showDownloadButton ? 'danger' : 'info'" 
                plain 
                @click="handleDownloadClick"
              >
                <el-icon><Download /></el-icon>
                {{ $t('button_download') }}
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10" justify="center" style="margin-top: 10px;">
            <el-col :span="12">
              <el-button 
                size="small" 
                :type="isFirstHelpClick ? 'warning' : 'info'" 
                plain 
                @click="handleHelpClick"
              >
                <el-icon><QuestionFilled /></el-icon>
                {{ $t('button_help') }}
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button 
                size="small" 
                :type="isFirstSponsorClick ? 'warning' : 'info'" 
                plain 
                @click="handleSponsorClick"
              >
                <el-icon><Star /></el-icon>
                {{ $t('button_sponsor') }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="dark-gray-bg header-container">
        <div>
          <h2>Phone2Pad Desktop - Beta</h2>
        </div>
      </el-header>

      <el-main class="white-bg main-content">
        <div class="controller-interface">
          <div class="controller-instructions"> 
            <el-text 
              style="font-size: 1.2rem;" 
              :type="serverStatus === 'normal' ? 'warning' : 'danger'"
              size="large"
            >
              <el-icon><InfoFilled /></el-icon> 
              <span v-html="$t(
                serverStatus === 'loading'
                  ? 'loading_instructions'
                  : serverStatus === 'normal' 
                    ? 'use_instructions' 
                    : serverStatus === 'no_vigem'
                      ? 'no_vigem_installed_instructions'
                      : serverStatus === 'no_network'
                        ? 'no_internet_instructions'
                        : 'unknown_error_instructions'
              )"> </span>
            </el-text>
          </div>

          <div class="gamepadbox-container">
            <el-scrollbar height="calc(75vh - 60px)" class="gamepadbox-scrollbar">
              <el-row :gutter="20" class="gamepadbox-grid">
                <el-col 
                  v-for="(gamepadInfo, index) in gamepadSlots" 
                  :key="index"                
                  :xs="24"
                  :sm="24"
                  :md="12"
                  class="gamepadbox-col"
                >
                  <div class="gamepadbox-wrapper">
                    <GamepadBox 
                      :box-number="index + 1"
                      :gamepad-type="gamepadInfo?.gamepadType || ''" 
                      :client-id="gamepadInfo?.clientId || -1"
                    />
                  </div>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
  <LanguageModal ref="languageModalRef" />
  <DownloadModal ref="downloadModalRef" />
  <HelpModal ref="helpModalRef" />
  <SponsorModal ref="sponsorModalRef" />
  <CloseConfirmModal ref="closeConfirmModalRef" />
</template>

<style>
body {
  font-family: 'sw_like_style';
}

.full-page {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.aside-container {
  background-color: #6c757d;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  height: 100%;
}

.qr-code-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.connection-info {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.connection-status, .ip-info, .port-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
}

.action-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-buttons .el-button {
  width: 100%;
  font-size: 12px;
}

.header-container {
  background-color: #6c757d;
  height: 15vh;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  color: white;
}

.header-content h2 {
  margin: 0;
  font-size: 1.5rem;
}

.main-content {
  background-color: #ffffff;
  color: #6c757d;
  flex: 1 1 auto;
  padding: 20px;
  overflow: hidden;
}

.controller-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.controller-instructions {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  margin: 5px 0;
  text-align: center;
}

.gamepadbox-container {
  width: 100%;
  height: 100%;
}

.gamepadbox-grid {
  width: 100%;
}

.gamepadbox-col {
  margin-bottom: 15px;
}

.gamepadbox-wrapper {
  height: 200px; 
}

.gamepadbox-scrollbar {
  --el-scrollbar-opacity: 0.3;
  --el-scrollbar-hover-opacity: 0.5;
  --el-scrollbar-width: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (max-width: 768px) {
  .aside-container {
    width: 250px !important;
  }
  
  .sidebar-content {
    gap: 20px;
  }
  
  .header-content h2 {
    font-size: 1.2rem;
  }
  
  .action-buttons .el-button {
    font-size: 10px;
  }
}

.el-text.el-text--danger {
  color: #F56C6C;
}
.el-text.el-text--warning {
  color: #E6A23C;
}

.el-button--danger.is-plain {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
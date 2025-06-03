<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'

import { ElContainer, ElHeader, ElMain, ElAside, ElSpace, ElButton, ElRow, ElCol, ElIcon, ElScrollbar, ElText } from 'element-plus'
import { ElementPlus, InfoFilled, QuestionFilled, Document, Download, Star } from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue'

import QRCode from 'qrcode'

import GamepadBox from './components/GamepadBox.vue';

const sessionIP = ref("No internet connection");
const sessionPort = ref("No internet connection");
const qrCanvas = ref(null)

const maxGamepads = ref(0);

interface GamepadSlot {
  clientId: number;
  gamepadType: string;
}

const gamepadSlots = ref<(GamepadSlot | null)[]>([]);

async function awakeCommunication() {
  await window.api.awake_wss();
}

async function startCommunication() {
  await window.api.start_wss(8080);
  const ipInfo = await window.api.get_server_ip();

  sessionIP.value = ipInfo.ips[0];
  sessionPort.value = ipInfo.port;
}

onMounted(async () => {
  await awakeCommunication();
  await startCommunication();

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
});
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
              <span>IP:</span>
              <el-button size="default" type="warning">{{ sessionIP }}</el-button>
            </div>
            <div class="port-info">
              <span>Port:</span>
              <el-button size="default" type="warning">{{ sessionPort }}</el-button>
            </div>
          </el-space>
        </div>

        <div class="action-buttons">
          <el-row :gutter="10" justify="center">
            <el-col :span="12">
              <el-button size="small" type="info" plain>
                <el-icon><QuestionFilled /></el-icon>
                {{ $t('button_help') }}
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="info" plain>
                <el-icon><Document /></el-icon>
                {{ $t('button_language') }}
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10" justify="center" style="margin-top: 10px;">
            <el-col :span="12">
              <el-button size="small" type="info" plain>
                <el-icon><Download /></el-icon>
                {{ $t('button_download') }}
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="info" plain>
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
            <el-text style="font-size: 1.2rem;" type="warning" size="large" ><el-icon><InfoFilled /></el-icon> <span v-html="$t('use_instructions')"> </span></el-text>
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
</style>
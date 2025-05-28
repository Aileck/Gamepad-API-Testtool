<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'

import { ElContainer, ElHeader, ElMain, ElAside, ElSpace, ElButton, ElRow, ElCol, ElIcon, ElScrollbar, ElText } from 'element-plus'
import { ElementPlus, InfoFilled } from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

import GamepadBox from './components/GamepadBox.vue'; // Import the GamepadBox component

const sessionIP = ref("Loading IP");
const sessionPort = ref("Loading Port");
const qrCanvas = ref(null)

const maxGamepads = ref(0);

interface GamepadSlot {
  clientId: number;
  gamepadType: string;
}

// Initialize empty player slots
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

  // Generate QR code with connection info
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

  // Handle gamepad registration events
  window.api.onGamepadRegistered((_, data) => {
    const emptySlotIndex = gamepadSlots.value.findIndex(slot => slot === null);
    
    if (emptySlotIndex !== -1) {
      const newSlots = [...gamepadSlots.value];
      newSlots[emptySlotIndex] = { ...data };
      gamepadSlots.value = newSlots;
    }
  });

  // Handle gamepad disconnection events
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
    <!-- Sidebar with QR code and connection info -->
    <el-aside class="dark-gray-bg aside-container" width="300px">
      <div class="sidebar-content">
        <!-- QR Code section -->
        <div class="qr-code-section">
          <canvas ref="qrCanvas"></canvas>
        </div>
        
        <!-- Connection information -->
        <div class="connection-info">
          <el-space direction="vertical" :size="20">
            <div class="connection-status">
              <el-icon><ElementPlus /></el-icon>
              <span>Connection Status: Succeeded</span>
            </div>
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
      </div>
    </el-aside>

    <el-container>
      <!-- Compact header -->
      <el-header class="dark-gray-bg header-container">
        <div>
          <h2>Phone2Pad Desktop - Beta</h2>
        </div>
      </el-header>

      <!-- Main content area -->
      <el-main class="white-bg main-content">
        <div class="controller-interface">
          <!-- Controller instructions -->
          <div class="controller-instructions"> 
            <el-text style="font-size: 1.2rem;" type="warning" size="large"><el-icon><InfoFilled /></el-icon> Use the Phone2Pad phone app to scan the QR code or enter the IP and port manually.</el-text>
          </div>

          <!-- GamepadBox container - responsive layout -->
          <div class="gamepadbox-container">
            <el-scrollbar height="calc(75vh - 60px)" class="gamepadbox-scrollbar">
              <el-row :gutter="20" class="gamepadbox-grid">
                <!-- Loop through player slots and create responsive columns -->              
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

/* Full page container */
.full-page {
  height: 100vh;
  width: 100vw;
  display: flex;
}

/* Sidebar styles */
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
}

.connection-status, .ip-info, .port-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

/* Compact header styles */
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

/* Main content styles */
.main-content {
  background-color: #ffffff;
  color: #6c757d;
  flex: 1 1 auto;
  padding: 20px;
  overflow: hidden; /* Prevent outer scrolling */
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
}

/* GamepadBox responsive container styles */
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

/* Custom styling for the Element Plus scrollbar */
.gamepadbox-scrollbar {
  --el-scrollbar-opacity: 0.3;
  --el-scrollbar-hover-opacity: 0.5;
  --el-scrollbar-width: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* Responsive design for smaller screens */
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
}
</style>
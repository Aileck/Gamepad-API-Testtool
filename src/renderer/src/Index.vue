<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'
import { GamepadType } from '@shared/enums';

import { ElContainer, ElHeader, ElMain, ElFooter, ElSpace, ElButton, ElText, ElRow, ElCol, ElIcon, ElScrollbar } from 'element-plus'
import { ElementPlus, DocumentCopy } from '@element-plus/icons-vue'

import { ref, onMounted, computed } from 'vue'
import GamepadBox from './components/GamepadBox.vue'; // Import the GamepadBox component

const sessionIP = ref("Loading IP");
const sessionPort = ref("Loading Port");

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
  awakeCommunication();
  startCommunication();

  maxGamepads.value = await window.api.getMaxGamepads();
  gamepadSlots.value = Array(maxGamepads.value).fill(null);

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
  <el-container class="full-page flex gap-4 mb-4">
    <el-header class="dark-gray-bg header-container">
      <el-row class="connection-info-bar">
        <el-col justify="center" align="middle">
          <el-space :size="10" spacer="">
            <el-icon>
              <ElementPlus />
            </el-icon>
            Connection Status: Succeeded
          </el-space>
        </el-col>

        <el-col justify="center" align="middle">
          <el-space :size="10" spacer="">
            IP: <el-button size="" type="warning" :icon="DocumentCopy">{{ sessionIP }}</el-button>
          </el-space>
        </el-col>

        <el-col justify="center" align="middle">
          <el-space :size="10" spacer="">
            Port: <el-button size="" type="warning" :icon="DocumentCopy">{{ sessionPort }}</el-button>
          </el-space>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="white-bg main-content">
      <div class="controller-interface">

        <!-- Controller instructions -->
        <div class="controller-instructions">
          Press 
          <span class="button-l">L</span> + 
          <span class="button-r">R</span> 
          on the controller.
        </div>

        <!-- GamepadBox container - responsive layout -->
        <div class="gamepadbox-container">
          <el-scrollbar height="60vh" class="gamepadbox-scrollbar">
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

    <el-footer class="dark-gray-bg footer-container">
      <div class="footer-content">
        <el-button>{{ sessionIP }}</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<style>
body {
  font-family: 'sw_like_style';
}

.connection-info-bar {
  flex-direction: column;
  row-gap: 8px;
}

.full-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6c757d;
  height: 15vh;
}

.footer-container {
  background-color: #6c757d;
  flex-shrink: 0;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

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

.button-l, .button-r {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #4361ee;
  color: white;
  border-radius: 4px;
  font-weight: bold;
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
</style>
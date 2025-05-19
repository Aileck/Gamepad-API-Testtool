<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'

import { ElContainer, ElHeader, ElMain, ElFooter, ElSpace, ElButton, ElText, ElRow, ElCol, ElIcon } from 'element-plus'
import { ElementPlus, DocumentCopy } from '@element-plus/icons-vue'

import { ref, onMounted, computed } from 'vue'
import GamepadBox from './components/GamepadBox.vue'; // Import the PlayerBox component

const sessionIP = ref("Loading IP");
const sessionPort = ref("Loading Port");
const players = ref<number[]>([]); // Array to hold player indices
const maxPlayers = ref(8); // Maximum number of players

// Initialize empty player slots
const playerSlots = ref<(number | null)[]>(Array(maxPlayers.value).fill(null));

async function awakeCommunication() {
  await window.api.awake_wss();
}

async function startCommunication() {
  await window.api.start_wss(8080);
  const ipInfo = await window.api.get_server_ip();

  sessionIP.value = ipInfo.ips[0];
  sessionPort.value = ipInfo.port;
}

onMounted(() => {
  // Start WSS and set info text to user
  awakeCommunication();
  startCommunication();
})
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

        <!-- Player boxes container - horizontal scrolling -->
        <div class="player-boxes-scroll-container">
          <div class="player-boxes-row">
            <div v-for="(playerNum, index) in playerSlots" :key="index" class="player-box-wrapper">
              <GamepadBox :player-number="index + 1" :active="playerNum !== null" />
            </div>
          </div>
        </div>
      </div>
    </el-main>

    <el-footer class="dark-gray-bg header-footer">
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

.header-footer {
  background-color: #6c757d;
  flex-shrink: 0;
  height: 15vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.button-back span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: white;
  color: #000;
  border-radius: 50%;
}

.main-content {
  background-color: #ffffff;
  color: #6c757d;
  flex: 1 1 auto;
  overflow: auto;
  padding: 20px;
}

.controller-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.controller-instructions {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content:start;
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

/* Horizontal scrolling container for player boxes */
.player-boxes-scroll-container {
  height: 90%;
  width: 90%;
  overflow-x: auto;
  margin: 10px 0;
  padding: 10px 0;
}

.player-boxes-row {
  display: flex;
  width: 30%;
  height: 100%; 
}

.player-box-wrapper {
  width: 100%;
  height: 100%;
  margin: 0 10px;
  flex-shrink: 0; /* Prevents the boxes from shrinking */
}

.button-a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #212529;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.demo-controls {
  margin-top: 20px;
}

/* Customize scrollbar for better visibility */
.player-boxes-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.player-boxes-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.player-boxes-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.player-boxes-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
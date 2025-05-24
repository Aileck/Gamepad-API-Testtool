<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import XboxButtonGroup from './XboxButtonGroup.vue';
import DualShockButtonGroup from './DualShockButtonGroup.vue';

import { GamepadType } from '@shared/enums';

import { ElCard, ElScrollbar } from 'element-plus';
import { xbox, dualshock4 } from "@renderer/scripts/svgLoader"

// Define props
const props = defineProps({
  boxNumber: {
    type: Number,
    required: true
  },
  clientId: {
    type: Number,
    required: true
  },
  gamepadType: {
    type: String,
    required: true
  }
});

// Component-specific logic
const isConnected = ref(false);
const delay = ref(0);

watch (
  () => props.clientId,
  (newVal, _) => {
    isConnected.value = newVal > -1;
  },
)
onMounted(() => {
  window.api.onGetDelay((_, data) => {
    if (data.id === props.clientId) {
      delay.value = data.delay;
    }
  })
})
</script>

<template>
  <el-card 
    class="gamepadbox"
    :shadow="isConnected ? 'always' : 'hover'"
  >
    <!-- Connected state - simple display -->
    <template v-if="!isConnected">
      <div class="player-number">{{ boxNumber }}</div>
    </template>
    
    <!-- Disconnected state - new layout according to the image -->
    <template v-else>
      <div class="layout-container">
        <!-- Top row with sections -->
        <div class="top-container">
          <!-- ID section (square) -->
          <div class="section square-section id-section">
            <div class="section-content">{{ boxNumber }}</div>
          </div>
          <!-- Device Name section -->
          <div class="section rg-cube-section">
            <div class="section-content">RG Cube</div>
          </div>
        </div>
        
        <!-- Bottom row with sections -->
        <div class="bottom-container">
          <!-- Left section (Console Icon) -->
          <div class="section square-section left-section">
            <div class="section-content icon-container">
              <component v-if="gamepadType === GamepadType.Xbox" class="xbox" :is="xbox.gamepad" />
              <component v-else-if="gamepadType === GamepadType.DualShock" class="dualshock" :is="dualshock4.gamepad" />
            </div>
          </div>
          
          <!-- Middle section (display cabinet with three parts) -->
          <el-scrollbar class="section middle-section">
            <XboxButtonGroup v-if="gamepadType === GamepadType.Xbox" :client-id="clientId" />
            <DualShockButtonGroup v-else-if="gamepadType === GamepadType.DualShock" :client-id="clientId" />
          </el-scrollbar>
          
          <!-- Right section (square) -->
          <div class="section square-section right-section">
            <div class="section-content">
              Delay <br>
              ~{{ delay }}ms
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
@import '../assets/button-cabinet.css';

.gamepadbox {
  height: 100%;
  width: 100%;
  min-height: 200px; 
  min-width: 300px; 
  transition: all 0.3s;
}

.gamepadbox :deep(.el-card__body) {
  height: 100%;
  min-height: 200px;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.layout-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.player-number {
  font-size: 2.5rem;
  color: #909399;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex: 1;
}

/* Section styling */
.section {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-content {
  padding: 8px;
  font-size: 0.9em;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Top container styling */
.top-container {
  display: flex;
  height: 50px; /* Fixed height for top row */
  width: 100%;
}

.rg-cube-section {
  flex: 1;
}

/* Bottom container styling */
.bottom-container {
  display: flex;
  flex: 1;
  width: 100%;
}

/* Square sections (left, right, and id) */
.square-section {
  aspect-ratio: 1/1;
  flex-shrink: 0;
  overflow: hidden; /* Prevent content from breaking the square shape */
}

/* Making sure squares have the same side length as their container height */
.id-section {
  width: 50px; /* Same as top-container height */
  height: 50px;
}

.left-section, .right-section {
  height: 100%; /* Full height of the bottom container */
  width: auto; /* Width determined by aspect-ratio */
}

/* Icon container and content styling */
.icon-container {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.icon-content {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

/* Middle section (flexible with min-width) */
.middle-section {
  flex: 1;
  min-width: 150px;
  overflow: hidden;
  margin: 0 4px; /* Add some spacing between left and right sections */
}

/* Cabinet layout styling */
.cabinet-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.cabinet-section {
  flex: 1;
  border-bottom: 1px solid #e4e7ed;
  min-height: 0;
  overflow: auto;
  padding: 4px;
  flex-direction: row;
}

.cabinet-section:last-child {
  border-bottom: none;
}

.cabinet-content {
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
  padding: 5px;
  width: 100%;
  height: 100%;
  min-height: 100%;
}

/* Individual item in the cabinet */
.cabinet-item {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px;
  text-align: center;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  word-break: break-word;
  overflow: hidden;
  transition: all 0.3s;
}

.cabinet-item:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

/* Custom scrollbar for better appearance */
.cabinet-section::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cabinet-section::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.cabinet-section::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.cabinet-section::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.xbox {
  fill: #107c10;
}

.dualshock {
  fill: #003087;
}

</style>
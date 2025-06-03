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
    
    <!-- Disconnected state - new layout with all info on left side -->
    <template v-else>
      <div class="layout-container">
        <!-- Main container with left info panel and right content -->
        <div class="main-container">
          <!-- Left panel (ID, Icon, Delay all together) -->
          <div class="section left-panel">
            <div class="left-panel-content">
              <!-- ID section -->
              <div class="id-section">
                <div class="id-content">{{ boxNumber }}</div>
              </div>
              <!-- Icon section -->
              <div class="icon-section">
                <div class="icon-container">
                  <component v-if="gamepadType === GamepadType.Xbox" class="xbox" :is="xbox.gamepad" />
                  <component v-else-if="gamepadType === GamepadType.DualShock" class="dualshock" :is="dualshock4.gamepad" />
                </div>
              </div>
              <!-- Delay section -->
              <div class="delay-section">
                <div class="delay-content">
                  <div class="delay-text">Delay</div>
                  <div class="delay-value">~{{ delay }}ms</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="right-panel">
            <div class="section device-number-section">
              <div class="section-content">Device Nº{{ boxNumber }}</div>
            </div>
            
            <!-- Bottom buttons section -->
            <el-scrollbar class="section middle-section">
              <XboxButtonGroup v-if="gamepadType === GamepadType.Xbox" :client-id="clientId" />
              <DualShockButtonGroup v-else-if="gamepadType === GamepadType.DualShock" :client-id="clientId" />
            </el-scrollbar>
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

/* Main container styling */
.main-container {
  display: flex;
  height: 100%;
  width: 100%;
}

/* Left panel (contains ID, Icon, Delay) */
.left-panel {
  width: 80px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid #e4e7ed;
}

.left-panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

/* ID section in left panel */
.id-section {
  height: 40px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.id-content {
  font-size: 0.9em;
  font-weight: 500;
}

/* Icon section in left panel */
.icon-section {
  flex: 1;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 8px;
}

.icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Delay section in left panel */
.delay-section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.delay-content {
  text-align: center;
}

.delay-text {
  font-size: 0.75em;
  font-weight: 500;
  margin-bottom: 2px;
  color: #606266;
}

.delay-value {
  font-size: 0.7em;
  color: #909399;
}

/* Right panel styling */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Device number section at top of right panel */
.device-number-section {
  height: 40px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

/* Middle section for buttons */
.middle-section {
  flex: 1;
  overflow: hidden;
  background-color: #f5f7fa;
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
  width: 100%;
  height: 100%;
}

.dualshock {
  fill: #003087;
  width: 100%;
  height: 100%;
}
</style>
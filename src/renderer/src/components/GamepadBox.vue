<script setup lang="ts">
import { ref, defineProps, computed } from 'vue';
import { ElCard, ElSpace, ElDivider, ElRow, ElCol, ElScrollbar } from 'element-plus';

// Define props
const props = defineProps({
  playerNumber: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

// Component-specific logic
const isConnected = ref(props.active);
const isReady = ref(false);

// Methods to handle player box states
function setConnected() {
  isConnected.value = true;
}

function setReady() {
  if (isConnected.value) {
    isReady.value = true;
  }
}
</script>

<template>
  <el-card 
    class="gamepadbox"
    :class="[
      { 'connected': isConnected },
      { 'ready': isReady }
    ]"
    :shadow="isConnected ? 'always' : 'hover'"
  >
    <!-- Connected state - simple display -->
    <template v-if="isConnected">
      <div class="player-number">{{ playerNumber }}</div>
    </template>
    
    <!-- Disconnected state - new layout according to the image -->
    <template v-else>
      <div class="layout-container">
        <!-- Top row with sections -->
        <div class="top-container">
          <!-- ID section (square) -->
          <div class="section square-section id-section">
            <div class="section-content">ID<br>{{ playerNumber }}</div>
          </div>
          <!-- Device Name section -->
          <div class="section rg-cube-section">
            <div class="section-content">RG Cube</div>
          </div>
        </div>
        
        <!-- Bottom row with sections -->
        <div class="bottom-container">
          <!-- Left section (square) -->
          <div class="section square-section left-section">
            <div class="section-content">Left</div>
          </div>
          
          <!-- Middle section (flexible with min-width and scroll) -->
          <el-scrollbar class="section middle-section">
            <div class="section-content middle-content">Middle Area</div>
          </el-scrollbar>
          
          <!-- Right section (square) -->
          <div class="section square-section right-section">
            <div class="section-content">Right</div>
          </div>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.gamepadbox {
  height: 100%;
  width: 100%;
  transition: all 0.3s;
}

.gamepadbox :deep(.el-card__body) {
  height: 100%;
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
}

/* Making sure squares have the same side length as their container height */
.id-section {
  width: 50px; /* Same as top-container height */
  height: 50px;
}

.left-section, .right-section {
  width: auto; /* Width will be determined by parent container height */
}

/* Middle section (flexible with min-width) */
.middle-section {
  flex: 1;
  min-width: 150px; /* Minimum size before scrolling */
  overflow: hidden;
}

.middle-content {
  min-width: 150px;
}

/* States styling */
.connected {
  border-color: #67c23a;
}

.ready {
  background-color: #f0f9eb;
}
</style>
<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { ElCard, ElSpace, ElDivider } from 'element-plus';

// Define props
const props = defineProps({
  playerNumber: {
    type: Number,
    required: true
  }
});

// Component-specific logic can be added here
const isConnected = ref(false);
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
    :class="[
      'player-box',
      { 'connected': isConnected },
      { 'ready': isReady }
    ]"
    :shadow="isConnected ? 'always' : 'hover'"
  >
    <template v-if="isConnected">
      <div class="player-number">{{ playerNumber }}</div>
    </template>
    
    <template v-else>
      <el-space direction="vertical" alignment="center" :size="0" fill style="width: 100%; height: 100%">
        <!-- Top section (10%) -->
        <div class="section top-section">
          RG Cube
        </div>
        
        <!-- Divider -->
        <el-divider />
        
        <!-- Second section (10%) -->
        <div class="section second-section">
          Section 2
        </div>
        
        <!-- Divider -->
        <el-divider />
        
        <!-- Main section (60%) -->
        <div class="section main-section">
          Main Content
        </div>
        
        <!-- Divider -->
        <el-divider />
        
        <!-- Bottom section (10%) -->
        <div class="section bottom-section">
          Bottom Content
        </div>
      </el-space>
    </template>
  </el-card>
</template>

<style scoped>
.player-box {
  height: 100%;
  width: 100%;
  transition: all 0.3s;
}

.player-box :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.player-number {
  font-size: 3rem;
  color: #909399;
}

.section {
  width: 100%;
  padding: 0.5rem;
  text-align: center;
}

.top-section {
  height: 5%;
  min-height: 10px;
}

.second-section {
  height: 10%;
  min-height: 30px;
}

.main-section {
  height: 60%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-section {
  height: 10%;
  min-height: 30px;
}

/* States styling */
.connected {
  border-color: #67c23a;
}

.ready {
  background-color: #f0f9eb;
}

:deep(.el-divider--horizontal) {
  margin: 8px 0;
}
</style>
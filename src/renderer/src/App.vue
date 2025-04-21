<script setup lang="ts">
import { ref, onMounted } from 'vue'

import XboxCard from './components/Xbox.vue'

const resultMessage = ref('')
const gamepads = ref<{ id: number; type: string}[]>([]) 

const handleInitialize = async () => {
  const result = await window.api.initialize()
  resultMessage.value = `Init => STATUS: ${result.status}, ERROR: ${result.error}`
}

const handleCreateXboxController = async () => {
  const result = await window.api.create_xbox_controller()
  if (result.error) {
    resultMessage.value = `Cannot create controller`
    return
  }

  resultMessage.value = `Create Controller ${result.content} => SUCCESS`
  
  gamepads.value.push({ id: result.content as number, type: "Xbox" })
}

const handleRelease = async () => {
  const result = await window.api.release()

  resultMessage.value = `Release => STATUS: ${result.status}, ERROR: ${result.error}`
}

// Initialize the gamepad controller on component mount
handleInitialize();

const scalerStyle = ref({})

const baseWidth = 1440  
const baseHeight = 900 

function updateScale() {
  const scaleX = window.innerWidth / baseWidth
  const scaleY = window.innerHeight / baseHeight
  const scale = Math.min(scaleX, scaleY)
  
  scalerStyle.value = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
  }
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})
</script>

<template>
  <div class="actions">
    <button @click="handleCreateXboxController">Create XBOX controller</button>
    <button @click="handleRelease">Release</button>
  </div>
  <div class="scroll-wrapper">
    <div class="controllers">
      <div
        v-for="gamepad in gamepads"
        :key="gamepad.id"
        class="controller"
      >
      <XboxCard :id="gamepad.id"></XboxCard>
      </div>
    </div>
  </div>

  <p class="tip">
    Result: {{ resultMessage }}
  </p>
</template>

<style>
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

/* .controllers {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.controller {
  border: 1px solid hsl(0, 0%, 80%);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
} */

.scroll-wrapper {
  overflow-x: auto;
  width: 100vw;
}

.controllers {
  display: flex;
  flex-direction: row;
  width: max-content;
  gap: 1rem;
}

.controller {
  border: 1px solid hsl(0, 0%, 80%);
  padding: 20px;
  border-radius: 8px;
  flex-shrink: 0;
}

.gamepad-layout {
  margin: 20px auto;
  border-collapse: collapse;
  text-align: center;
}

.gamepad-layout td {
  padding: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
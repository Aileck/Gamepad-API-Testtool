<script setup lang="ts">
import { ref } from 'vue'

import LogPanel from './components/LogPanel.vue'

const resultMessage = ref('')
const gamepads = ref<{ id: number; type: string}[]>([]) 
const logPanelRef = ref()

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

const handleCreateDualShockController = async () => {
  const result = await window.api.create_ds4_controller()
  if (result.error) {
    resultMessage.value = `Cannot create controller`
    return
  }

  resultMessage.value = `Create Controller ${result.content} => SUCCESS`

  gamepads.value.push({ id: result.content as number, type: "DualShock" })
}

const handleRelease = async () => {
  const result = await window.api.release()
  gamepads.value = [];
  resultMessage.value = `Release => STATUS: ${result.status}, ERROR: ${result.error}`
}

const awakeCommunication = async() => {
  await window.api.awake_wss();
}

const startCommunication = async() => {
  await window.api.start_wss(8080);
  logPanelRef.value.addLog(await window.api.get_server_ip())
}

// Initialize the gamepad controller on component mount
handleInitialize();

window.api.write_to_log((_, message) => {
  logPanelRef.value.addLog(`${message}`)
})
</script>

<template>
  <div class="actions">
    <button @click="handleCreateXboxController">Create XBOX controller</button>
    <button @click="handleCreateDualShockController">Create DS4 controller</button>

    <button @click="handleRelease">Release</button>
  </div>
  <div class="actions">
    <button @click="awakeCommunication">Init Communication</button>
    <button @click="startCommunication">Start Communication</button>
  </div>
  <div class="scroll-wrapper">
    <LogPanel  ref="logPanelRef" />

    <div class="controllers">
      <div
        v-for="gamepad in gamepads"
        :key="gamepad.id"
        class="controller"
      >
        <p>{{ gamepad.type }} - {{ gamepad.id }}</p>
        <div v-if="gamepad.type === 'Xbox'">
          <XboxCard :id="gamepad.id" />
        </div>
        <div v-else-if="gamepad.type === 'DualShock'">
          <DualShockCard :id="gamepad.id" />
        </div>
        <div v-else>
          <p>Unknown controller type</p>
      </div>
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
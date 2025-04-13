<script setup lang="ts">
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

// 狀態回傳顯示
const resultMessage = ref('')

// 封裝的函式呼叫
const handleInitialize = async () => {
  const result = await window.api.initialize()
  resultMessage.value = `Init => STATUS: ${result.STATUS}, ERROR: ${result.error}`
}

const handleCreateController = async () => {
  const result = await window.api.create_xbox_controller()
  resultMessage.value = `Create => STATUS: ${result.STATUS}, ERROR: ${result.error}`
}

const handleDpadDown = async () => {
  while (true) {
    const result = await window.api.xbox_down_dpad_controller()
    resultMessage.value = `D-Pad Down => STATUS: ${result.STATUS}, ERROR: ${result.error}`
  }
}

const handleRelease = async () => {
  const result = await window.api.release()
  resultMessage.value = `Release => STATUS: ${result.STATUS}, ERROR: ${result.error}`
}
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Press <code>F12</code> to open devTools</p>

  <div class="actions">
    <div class="action">
      <a @click="ipcHandle">Send IPC (ping)</a>
    </div>
    <div class="action">
      <button @click="handleInitialize">Initialize Controller</button>
    </div>
    <div class="action">
      <button @click="handleCreateController">Create Xbox Controller</button>
    </div>
    <div class="action">
      <button @click="handleDpadDown">D-pad Down</button>
    </div>
    <div class="action">
      <button @click="handleRelease">Release Controller</button>
    </div>
  </div>

  <p class="tip">
    Result: {{ resultMessage }}
  </p>

  <Versions />
</template>

<script setup lang="ts">
import '../../../assets/styles/fonts.css';
import '../../../node_modules/element-plus/dist/index.css'

import { ElContainer, ElHeader, ElMain, ElFooter, ElSpace, ElButton, ElText, ElRow, ElCol, ElIcon } from 'element-plus'
import { ElementPlus, DocumentCopy } from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue'

const sessionIP = ref("Loading IP");
const sessionPort = ref("Loading Port");

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
                IP: <el-button size="" type="warning" :icon="DocumentCopy" >{{ sessionIP }}</el-button>
              </el-space>
          </el-col>

          <el-col justify="center" align="middle">
              <el-space :size="10" spacer="">
                Port: <el-button size="" type="warning" :icon="DocumentCopy" >{{ sessionPort }}</el-button>
              </el-space>
          </el-col>
        </el-row>
    </el-header>

    <el-main class="white-bg main-content">

    </el-main>

    <el-footer class="dark-gray-bg header-footer">
      <el-button>{{ sessionIP }}</el-button>

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
}

.header-footer:last-child {
  height: 15vh; 
}

.main-content {
  background-color: #ffffff;
  color: #6c757d;
  flex: 1 1 auto; 
  overflow: auto;
}
</style>

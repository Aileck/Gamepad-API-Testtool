<template>
    <div class="log-panel">
      <div class="log-header">
        <slot name="header">
          <h3>Log</h3>
        </slot>
        <div class="log-actions">
          <button @click="clearLogs" class="clear-btn">Clear</button>
        </div>
      </div>
      <div 
        ref="logContainer" 
        class="log-container" 
        @scroll="handleScroll">
        <div v-for="(log, index) in logs" :key="index" class="log-line">
          <span class="log-timestamp">{{ log.timestamp }}</span>
          <span :class="['log-message', `log-level-${log.level}`]">{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="empty-log">
          Empty log. No messages to display.
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LogPanel',
    props: {
      maxLines: {
        type: Number,
        default: 1000
      },
      autoScroll: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        logs: [],
        userScrolled: false
      }
    },
    methods: {
      addLog(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({
          message,
          timestamp,
          level
        });
        
        if (this.logs.length > this.maxLines) {
          this.logs = this.logs.slice(this.logs.length - this.maxLines);
        }
        
        this.$nextTick(() => {
          if (this.autoScroll && !this.userScrolled) {
            this.scrollToBottom();
          }
        });
      },
      

      info(message) {
        this.addLog(message, 'info');
      },
      
      warn(message) {
        this.addLog(message, 'warn');
      },
      
      error(message) {
        this.addLog(message, 'error');
      },
      
      clearLogs() {
        this.logs = [];
      },
      
      scrollToBottom() {
        if (this.$refs.logContainer) {
          const container = this.$refs.logContainer;
          container.scrollTop = container.scrollHeight;
        }
      },
      
      handleScroll() {
        const container = this.$refs.logContainer;
        const isScrolledToBottom = 
          container.scrollHeight - container.scrollTop - container.clientHeight < 10;
        
        this.userScrolled = !isScrolledToBottom;
        
        if (isScrolledToBottom) {
          this.userScrolled = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .log-panel {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fafafa;
    height: 100%;
    min-height: 500px;
    width: 100%;
    min-width: 100%;
    font-family: monospace;
  }
  
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }
  
  .log-header h3 {
    margin: 0;
    font-size: 14px;
  }
  
  .log-actions {
    display: flex;
  }
  
  .clear-btn {
    background: transparent;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 2px 8px;
    font-size: 12px;
    cursor: pointer;
  }
  
  .clear-btn:hover {
    background-color: #eee;
  }
  
  .log-container {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    background-color: #1e1e1e;
    color: #ddd;
    width: 100%;
    box-sizing: border-box;
  }
  
  .log-line {
    padding: 2px 0;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-all;
    width: 100%;
    display: flex;
  }
  
  .log-timestamp {
    color: #999;
    margin-right: 8px;
    font-size: 12px;
  }
  
  .log-message {
    font-size: 13px;
    flex: 1;
    min-width: 0;
  }
  
  .log-level-info {
    color: #4caf50;
  }
  
  .log-level-warn {
    color: #ff9800;
  }
  
  .log-level-error {
    color: #f44336;
  }
  
  .empty-log {
    color: #777;
    font-style: italic;
    padding: 10px;
    text-align: center;
  }
  </style>
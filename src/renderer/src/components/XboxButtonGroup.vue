<script setup lang="ts">
    import { defineProps } from 'vue';
    import { commun, xbox } from "@renderer/scripts/svgLoader"

    // Define props
    const props = defineProps({
    });
</script>

<template>
    <div class="cabinet-container">
      <!-- Top cabinet section -->
      <div class="cabinet-section">
        <div class="cabinet-content">
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
        </div>
      </div>
      
      <!-- Middle cabinet section -->
      <div class="cabinet-section">
        <div class="cabinet-content">
            <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />       
         </div>
      </div>
      
      <!-- Bottom cabinet section -->
      <div class="cabinet-section">
        <div class="cabinet-content">
            <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />
          <component class="xboxButton xbox" :is="xbox.button_a_press" />        </div>
      </div>
    </div>
  </template>
  

  
  <style scoped>
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
    padding: 4px;
    width: 100%;
    height: 100%;
    min-height: 100%;
  }
  
  .xboxButton {
  height: 1em;
  width: 1em;
}

.xbox * {
  fill: #2c5915;
}
  </style>
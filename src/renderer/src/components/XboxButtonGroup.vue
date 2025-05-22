<script setup lang="ts">
import { xbox, commun } from "@renderer/scripts/svgLoader"

const props = defineProps({
  // Add props to control button count or type if needed
})


</script>

<template>
  <div class="cabinet-container">
    <!-- Top cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="xbox.lt_release" />
        <component class="gamepad-button-small xbox" :is="xbox.lb_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="xbox.back_release" />
        <component class="gamepad-button-small xbox" :is="xbox.start_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="xbox.rb_release" />
        <component class="gamepad-button-small xbox" :is="xbox.rt_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        
      </div>
    </div>
    
    <!-- Middle cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="xbox.ls_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="xbox.x_release" />
        <component class="gamepad-button-small xbox" :is="xbox.y_release" />
        <component class="gamepad-button-small xbox" :is="xbox.a_release" />
        <component class="gamepad-button-small xbox" :is="xbox.b_release" />
      </div>
    </div>
    
    <!-- Bottom cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">                  
        <component class="gamepad-button-small xbox" :is="commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="xbox.rs_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty_stick" />
      </div>
    </div>
  </div>
</template>

<style>
/* Import shared cabinet styles */
@import '../assets/button-cabinet.css';
</style>
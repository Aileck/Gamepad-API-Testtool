<script setup lang="ts">
import { xbox, commun } from "@renderer/scripts/svgLoader"
import { GamepadData } from "@shared/types"
import { onMounted, ref } from "vue";

const props = defineProps({
  clientId: {
    type: Number,
    required: true
  }
})

const gamepadData = ref<GamepadData>({
  buttonEast: false,
  buttonWest: false,
  buttonNorth: false,
  buttonSouth: false,
  up: false,
  down: false,
  left: false,
  right: false,
  leftShoulder: false,
  rightShoulder: false,
  leftTrigger: false,
  rightTrigger: false,
  leftStickButton: false,
  rightStickButton: false,
  leftStickX: 0,
  leftStickY: 0,
  rightStickX: 0,
  rightStickY: 0,
  buttonStart: false,
  buttonSelect: false
})

onMounted(() => {
  window.api.onXboxInput((_, data) => {
    console.log("Gamepad input: " + data.id);

    if (data.id === props.clientId) {
      gamepadData.value = data.gamepadData;
    }
  })
})


</script>

<template>
  <div class="cabinet-container">
    <!-- Top cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftTrigger ? xbox.lt_press : xbox.lt_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftShoulder ? xbox.lb_press : xbox.lb_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonSelect ? xbox.back_press : xbox.back_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonStart ? xbox.start_press : xbox.start_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightShoulder ? xbox.rb_press : xbox.rb_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightTrigger ? xbox.rt_press : xbox.rt_release" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
      </div>
    </div>
    
    <!-- Middle cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">
        <component class="gamepad-button-small xbox" :is="gamepadData.leftStickY > 0 ? xbox.stick_l_up_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftStickX < 0 ? xbox.stick_l_left_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftStickButton ? xbox.ls_press : xbox.ls_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftStickX > 0 ? xbox.stick_l_right_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.leftStickY < 0 ? xbox.stick_l_down_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonWest ? xbox.x_press : xbox.x_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonNorth ? xbox.y_press : xbox.y_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonSouth ? xbox.a_press : xbox.a_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.buttonEast ? xbox.b_press : xbox.b_release" />
      </div>
    </div>
    
    <!-- Bottom cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">                  
        <component class="gamepad-button-small xbox" :is="gamepadData.up ? xbox.dpad_up_press : commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="gamepadData.down ? xbox.dpad_down_press : commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="gamepadData.left ? xbox.dpad_left_press : commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="gamepadData.right ? xbox.dpad_right_press : commun.empty_dpad" />
        <component class="gamepad-button-small xbox" :is="commun.empty" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightStickY > 0 ? xbox.stick_r_up_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightStickX < 0 ? xbox.stick_r_left_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightStickButton ? xbox.rs_press : xbox.rs_release" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightStickX > 0 ? xbox.stick_r_right_press : commun.empty_stick" />
        <component class="gamepad-button-small xbox" :is="gamepadData.rightStickY < 0 ? xbox.stick_r_down_press : commun.empty_stick" />
      </div>
    </div>
  </div>
</template>

<style>
/* Import shared cabinet styles */
@import '../assets/button-cabinet.css';
</style>
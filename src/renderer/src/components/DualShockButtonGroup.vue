<script setup lang="ts">
import { dualshock4, commun } from "@renderer/scripts/svgLoader"
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
  window.api.onDualShockInput((_, data) => {
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
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftTrigger ? dualshock4.l2_press : dualshock4.l2_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftShoulder ? dualshock4.l1_press : dualshock4.l1_release" />
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonSelect ? dualshock4.share_press : dualshock4.share_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonStart ? dualshock4.options_press : dualshock4.options_release" />
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightShoulder ? dualshock4.r1_press : dualshock4.r1_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightTrigger ? dualshock4.r2_press : dualshock4.r2_release" />
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
      </div>
    </div>
    
    <!-- Middle cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">
        <component class="gamepad-button-small dualshock" :is="gamepadData.left  ? dualshock4.dpad_left_press : dualshock4.empty_dpad" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.up ? dualshock4.dpad_up_press : dualshock4.empty_dpad" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.down ? dualshock4.dpad_down_press : dualshock4.empty_dpad" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.right ? dualshock4.dpad_right_press : dualshock4.empty_dpad" />
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonWest ? dualshock4.square_press : dualshock4.square_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonNorth ? dualshock4.triangle_press : dualshock4.triangle_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonSouth ? dualshock4.cross_press : dualshock4.cross_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.buttonEast ? dualshock4.circle_press : dualshock4.circle_release" />
      </div>
    </div>
    
    <!-- Bottom cabinet section -->
    <div class="cabinet-section">
      <div class="cabinet-content">                  
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftStickX < 0 ? dualshock4.stick_l_left_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftStickY > 0 ? dualshock4.stick_l_up_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftStickButton ? dualshock4.l3_press : dualshock4.l3_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftStickY < 0 ? dualshock4.stick_l_down_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.leftStickX > 0 ? dualshock4.stick_l_right_press : commun.empty_stick" />
          <component class="gamepad-button-small dualshock" :is="commun.empty" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightStickX < 0 ? dualshock4.stick_r_left_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightStickY > 0 ? dualshock4.stick_r_up_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightStickButton ? dualshock4.r3_press : dualshock4.r3_release" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightStickY < 0 ? dualshock4.stick_r_down_press : commun.empty_stick" />
        <component class="gamepad-button-small dualshock" :is="gamepadData.rightStickX > 0 ? dualshock4.stick_r_right_press : commun.empty_stick" />
      </div>
    </div>
  </div>
</template>

<style>
/* Import shared cabinet styles */
@import '../assets/button-cabinet.css';
</style>
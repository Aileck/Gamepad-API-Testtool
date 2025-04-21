<script setup lang="ts">
import { ref } from 'vue'
import { DS4Input } from '../../../shared/enums'
import { InputPayload } from '../../../shared/types'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// Track toggle states for all buttons
const buttonStates = ref(new Map())
const stickStates = ref(new Map())
const triggerStates = ref(new Map())

const STICK_MAX = -255;
const STICK_CENTER = 128;
const TRIGGER_MAX = 255;

const toggleButton = async (input: DS4Input) => {
  const newState = !buttonStates.value.get(input)
  buttonStates.value.set(input, newState)
  await handleDS4InputButton(props.id, input, newState)
}

const handleDS4InputButton = async (id: number, input: DS4Input, pressed: boolean) => {
  const payload = { isPressed: pressed } as InputPayload
  await window.api.ds4_input(id, input, payload)
}

const handleDS4InputStick = async (id: number, input: DS4Input, valueX: number, valueY: number) => {
  const payload = { 
    stick: {
      x: valueX,
      y: valueY
    }
  } as InputPayload
  
  await window.api.ds4_input(id, input, payload)
}

const handleDS4InputTrigger = async (id: number, input: DS4Input, value: number) => {
  const payload = { trigger: value } as InputPayload
  
  await window.api.ds4_input(id, input, payload)
}

const toggleStickDirection = (input: DS4Input, direction: 'UP'|'DOWN'|'LEFT'|'RIGHT'|'UP_LEFT'|'UP_RIGHT'|'DOWN_LEFT'|'DOWN_RIGHT') => {
  const stickKey = `${input}-${direction}`
  const newState = !stickStates.value.get(stickKey)
  stickStates.value.set(stickKey, newState)
  
  let x = STICK_CENTER;
  let y = STICK_CENTER;
  
  if (newState) {
    switch(direction) {
      case 'UP': y = STICK_MAX; break;
      case 'DOWN': y = -STICK_MAX; break;
      case 'LEFT': x = 0; break;
      case 'RIGHT': x = -STICK_MAX; break;
      case 'UP_LEFT': x = 0; y = STICK_MAX; break;
      case 'UP_RIGHT': x = STICK_MAX; y = STICK_MAX; break;
      case 'DOWN_LEFT': x = 0; y = -STICK_MAX; break;
      case 'DOWN_RIGHT': x = -STICK_MAX; y = -STICK_MAX; break;
    }
  }
  
  return handleDS4InputStick(props.id, input, x, y);
}

const toggleTrigger = async (input: DS4Input) => {
  const newState = !triggerStates.value.get(input)
  triggerStates.value.set(input, newState)
  await handleDS4InputTrigger(props.id, input, newState ? TRIGGER_MAX : 0)
}
</script>

<template>
  <div style="position: relative; width: 100%; height: 100%;text-align: center">
    <p>DualShock - {{ id }}</p>
    <table border="1" style="table-layout: fixed;">
      <tr>
        <td><button :class="{ active: triggerStates.get(DS4Input.L2) }" @click="toggleTrigger(DS4Input.L2)">L2</button></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.L1) }" @click="toggleButton(DS4Input.L1)">L1</button></td>
        <td></td><td></td><td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.R1) }" @click="toggleButton(DS4Input.R1)">R1</button></td>
        <td><button :class="{ active: triggerStates.get(DS4Input.R2) }" @click="toggleTrigger(DS4Input.R2)">R2</button></td>
      </tr>
      <tr>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>
      <tr>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-UP_LEFT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'UP_LEFT')">↖</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-UP`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'UP')">↑</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-UP_RIGHT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'UP_RIGHT')">↗</button></td>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.TRIANGLE) }" @click="toggleButton(DS4Input.TRIANGLE)">△</button></td>
        <td></td>
      </tr>
      <tr>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-LEFT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'LEFT')">←</button></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.L3) }" @click="toggleButton(DS4Input.L3)">L3</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-RIGHT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'RIGHT')">→</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.SQUARE) }" @click="toggleButton(DS4Input.SQUARE)">□</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.CIRCLE) }" @click="toggleButton(DS4Input.CIRCLE)">○</button></td>
      </tr>
      <tr>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-DOWN_LEFT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'DOWN_LEFT')">↙</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-DOWN`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'DOWN')">↓</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.LEFT_STICK}-DOWN_RIGHT`) }" 
                    @click="toggleStickDirection(DS4Input.LEFT_STICK, 'DOWN_RIGHT')">↘</button></td>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.CROSS) }" @click="toggleButton(DS4Input.CROSS)">×</button></td>
        <td></td>
      </tr>
      <tr>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.SHARE) }" @click="toggleButton(DS4Input.SHARE)">Share</button></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.PS) }" @click="toggleButton(DS4Input.PS)">PS</button></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.OPTIONS) }" @click="toggleButton(DS4Input.OPTIONS)">Options</button></td>
        <td></td><td></td>
      </tr>
      <tr>
        <td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.UP) }" @click="toggleButton(DS4Input.UP)">D-↑</button></td>
        <td></td><td></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-UP_LEFT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'UP_LEFT')">↖</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-UP`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'UP')">↑</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-UP_RIGHT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'UP_RIGHT')">↗</button></td>
      </tr>
      <tr>
        <td><button :class="{ active: buttonStates.get(DS4Input.LEFT) }" @click="toggleButton(DS4Input.LEFT)">D-←</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.RIGHT) }" @click="toggleButton(DS4Input.RIGHT)">D-→</button></td>
        <td></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-LEFT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'LEFT')">←</button></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.R3) }" @click="toggleButton(DS4Input.R3)">R3</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-RIGHT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'RIGHT')">→</button></td>
      </tr>
      <tr>
        <td></td>
        <td><button :class="{ active: buttonStates.get(DS4Input.DOWN) }" @click="toggleButton(DS4Input.DOWN)">D-↓</button></td>
        <td></td><td></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-DOWN_LEFT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'DOWN_LEFT')">↙</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-DOWN`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'DOWN')">↓</button></td>
        <td><button :class="{ active: stickStates.get(`${DS4Input.RIGHT_STICK}-DOWN_RIGHT`) }"
                    @click="toggleStickDirection(DS4Input.RIGHT_STICK, 'DOWN_RIGHT')">↘</button></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
button {
  width: 100%;
  padding: 8px;
}

button.active {
  background-color: #4CAF50;
  color: white;
}
</style>

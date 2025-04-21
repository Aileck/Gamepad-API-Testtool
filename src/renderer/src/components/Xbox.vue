<script setup lang="ts">
import { ref } from 'vue'
import { XboxInput } from '../../../shared/enums'
import { XboxInputPayload } from '../../../shared/types'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// Track toggle states for all buttons
const buttonStates = ref(new Map())

const toggleButton = async (input: XboxInput) => {
  const newState = !buttonStates.value.get(input)
  buttonStates.value.set(input, newState)
  await handleXboxInputButton(props.id, input, newState)
}

const handleXboxInputButton = async (id: number, input: XboxInput, pressed: boolean) => {
  const payload = { isPressed: pressed } as XboxInputPayload
  await window.api.xbox_input(id, input, payload)
}

const handleXboxInputStick = async (id: number, input: XboxInput, valueX: number, valueY: number) => {
  const payload = { 
    stick: {
      x: valueX,
      y: valueY
    }
  } as XboxInputPayload
  
  await window.api.xbox_input(id, input, payload)
}

const handleXboxInputTrigger = async (id: number, input: XboxInput, value: number) => {
  const payload = { trigger: value } as XboxInputPayload
  
  await window.api.xbox_input(id, input, payload)
}
</script>

<template>
  <div style="position: relative; width: 100%; height: 100%;text-align: center">
    <p>Xbox - {{ id }}</p>
    <table border="1" style="table-layout: fixed;">
      <tr>
        <td><button :class="{ active: buttonStates.get(XboxInput.LT) }" @click="toggleButton(XboxInput.LT)">LT</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.LB) }" @click="toggleButton(XboxInput.LB)">LB</button></td>
        <td></td><td></td><td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.RB) }" @click="toggleButton(XboxInput.RB)">RB</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.RT) }" @click="toggleButton(XboxInput.RT)">RT</button></td>
      </tr>
      <tr>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>
      <tr>
        <td><button>↖</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.UP) }" @click="toggleButton(XboxInput.UP)">↑</button></td>
        <td><button>↗</button></td>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.Y) }" @click="toggleButton(XboxInput.Y)">Y</button></td>
        <td></td>
      </tr>
      <tr>
        <td><button :class="{ active: buttonStates.get(XboxInput.LEFT) }" @click="toggleButton(XboxInput.LEFT)">←</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.LEFT_STICK) }" @click="toggleButton(XboxInput.LSB)">LSB</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.RIGHT) }" @click="toggleButton(XboxInput.RIGHT)">→</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.X) }" @click="toggleButton(XboxInput.X)">X</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.B) }" @click="toggleButton(XboxInput.B)">B</button></td>
      </tr>
      <tr>
        <td><button>↙</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.DOWN) }" @click="toggleButton(XboxInput.DOWN)">↓</button></td>
        <td><button>↘</button></td>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.A) }" @click="toggleButton(XboxInput.A)">A</button></td>
        <td></td>
      </tr>
      <tr>
        <td></td><td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.BACK) }" @click="toggleButton(XboxInput.BACK)">Back</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.GUIDE) }" @click="toggleButton(XboxInput.GUIDE)">⦻</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.START) }" @click="toggleButton(XboxInput.START)">Start</button></td>
        <td></td><td></td>
      </tr>
      <tr>
        <td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.UP) }" @click="toggleButton(XboxInput.UP)">D-↑</button></td>
        <td></td><td></td>
        <td><button>↖</button></td>
        <td><button>↑</button></td>
        <td><button>↗</button></td>
      </tr>
      <tr>
        <td><button :class="{ active: buttonStates.get(XboxInput.LEFT) }" @click="toggleButton(XboxInput.LEFT)">D-←</button></td>
        <td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.RIGHT) }" @click="toggleButton(XboxInput.RIGHT)">D-→</button></td>
        <td></td>
        <td><button>←</button></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.RIGHT_STICK) }" @click="toggleButton(XboxInput.RSB)">RSB</button></td>
        <td><button>→</button></td>
      </tr>
      <tr>
        <td></td>
        <td><button :class="{ active: buttonStates.get(XboxInput.DOWN) }" @click="toggleButton(XboxInput.DOWN)">D-↓</button></td>
        <td></td><td></td>
        <td><button>↙</button></td>
        <td><button>↓</button></td>
        <td><button>↘</button></td>
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

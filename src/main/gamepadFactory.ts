import { system, xbox, dualshock4 } from './ffi';
import { XboxInput, DS4Input, GamepadType } from '../shared/enums'
import { InputPayload, GamepadData } from '../shared/types'

async function initializeGamepadSystem(): Promise<any> {
    const result = await system.initialize();

    return result;
}

async function createGamepad(type: GamepadType): Promise<number> {
    const idBuffer = Buffer.alloc(4);

    if (type === GamepadType.Xbox) {
        await xbox.create(idBuffer);
    }
    else if (type === GamepadType.DualShock) {
        await dualshock4.create(idBuffer);
    } else {
        throw new Error(`Unsupported gamepad type: ${type}`);
    }

    const id = idBuffer.readInt32LE();
    
    return id;
}

// // Release xbox gamepad with the given ID
// async function releaseXboxGamepad(gamepadID: number): Promise<any> {
//     const result = await xbox.release(gamepadID);
//     return result;
// }

async function xboxInput(gamepadID: number, gamepadData: GamepadData): Promise<any> {
  // Uses array since gamepadData.leftStick and rightStick are from Unity
  const normalizedLeftStick = normalizedXboxStick(gamepadData.leftStick[0], gamepadData.leftStick[1]);
  const normalizedRightStick = normalizedXboxStick(gamepadData.rightStick[0], gamepadData.rightStick[1]);

  const normalizedLeftTrigger = normalizeXboxTrigger(gamepadData.leftTrigger ? 1 : 0);
  const normalizedRightTrigger = normalizeXboxTrigger(gamepadData.rightTrigger ? 1 : 0);
  
  xbox.input_a(gamepadID, gamepadData.buttonSouth);
  xbox.input_b(gamepadID, gamepadData.buttonEast);
  xbox.input_x(gamepadID, gamepadData.buttonWest);
  xbox.input_y(gamepadID, gamepadData.buttonNorth);

  xbox.input_up(gamepadID, gamepadData.up);
  xbox.input_down(gamepadID, gamepadData.down);
  xbox.input_left(gamepadID, gamepadData.left);
  xbox.input_right(gamepadID, gamepadData.right);

  xbox.input_lb(gamepadID, gamepadData.leftShoulder);
  xbox.input_rb(gamepadID, gamepadData.rightShoulder);

  xbox.input_lt(gamepadID, normalizedLeftTrigger);
  xbox.input_rt(gamepadID, normalizedRightTrigger);

  xbox.input_left_stick(gamepadID, normalizedLeftStick.x, normalizedLeftStick.y);
  xbox.input_right_stick(gamepadID, normalizedRightStick.x, normalizedRightStick.y);

  xbox.input_left_analog_button(gamepadID, gamepadData.leftStickButton);
  xbox.input_right_analog_button(gamepadID, gamepadData.rightStickButton);

  xbox.input_back(gamepadID, gamepadData.buttonSelect);
  xbox.input_start(gamepadID, gamepadData.buttonStart);
}

async function xboxInputLegacy(gamepadID: number, input: XboxInput, inputPayload: InputPayload): Promise<any> {
    let result;

    switch (input) {
      case XboxInput.A:
        result = await xbox.input_a(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.B:
        console.log(inputPayload);

        result = await xbox.input_b(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.X:
        result = await xbox.input_x(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.Y:
        result = await xbox.input_y(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.UP:
        result = await xbox.input_up(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.DOWN:
        result = await xbox.input_down(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LEFT:
        result = await xbox.input_left(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RIGHT:
        result = await xbox.input_right(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LB:
        result = await xbox.input_lb(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RB:
        result = await xbox.input_rb(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LT:
        result = await xbox.input_lt(gamepadID, inputPayload.trigger);
        break;
      case XboxInput.RT:
        result = await xbox.input_rt(gamepadID, inputPayload.trigger);
        break;
      case XboxInput.LEFT_STICK:
        result = await xbox.input_left_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case XboxInput.RIGHT_STICK:
        result = await xbox.input_right_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case XboxInput.LSB:
        result = await xbox.input_left_analog_button(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RSB:
        result = await xbox.input_right_analog_button(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.BACK:
        result = await xbox.input_back(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.START:
        result = await xbox.input_start(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.GUIDE:
        result = await xbox.input_guide(gamepadID, inputPayload.isPressed);
        break;
      default:
        throw new Error('Invalid XboxInput');
    }

    return result;
}

function normalizedXboxStick(x: number, y: number): { x: number; y: number } {
  function normalizeAxis(value: number): number {
    // Clamp value between -1 and 1
    value = Math.max(-1, Math.min(1, value));

    // Handle edge case: -1 maps to -32768
    if (value === -1) return -32768;

    return Math.round(value * 32767);
  }

  return {
    x: normalizeAxis(x),
    y: normalizeAxis(y),
  };
}

function normalizeXboxTrigger(value: number): number {
  // Clamp value between 0 and 1
  value = Math.max(0, Math.min(1, value));

  return Math.round(value * 255);
}

export {
    initializeGamepadSystem,
    createGamepad,
    xboxInputLegacy,
    xboxInput,
}
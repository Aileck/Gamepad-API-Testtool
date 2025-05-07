import { GamepadType } from '../shared/types'; 
import { system, xbox, dualshock4 } from './ffi';
import { XboxInput, DS4Input } from '../shared/enums'
import { InputPayload } from '../shared/types'

async function initializeGamepadSystem(): Promise<any> {
    const result = await system.initialize();

    return result;
}

async function createGamepad(type: GamepadType): Promise<number> {
    const idBuffer = Buffer.alloc(4);

    if (type === "GAMEPAD_XBOX360") {
        await xbox.create(idBuffer);
    }
    else if (type === "GAMEPAD_DUALSHOCK4") {
        await dualshock4.create(idBuffer);
    } else {
        throw new Error(`Unsupported gamepad type: ${type}`);
    }

    const id = idBuffer.readInt32LE();
    
    return id;
}

async function xboxInput(gamepadID: number, input: XboxInput, inputPayload: InputPayload): Promise<any> {
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

export {
    initializeGamepadSystem,
    createGamepad,
    xboxInput
}
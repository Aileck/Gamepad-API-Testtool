export type InputPayload = {
    isPressed?: boolean;
    stick?: { x: number; y: number };
    trigger?: number;
  }

export type GamepadType = "GAMEPAD_XBOX360" | "GAMEPAD_DUALSHOCK4"
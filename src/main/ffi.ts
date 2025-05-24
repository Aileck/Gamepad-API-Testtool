import koffi from 'koffi';
import path from 'path';
import { app } from 'electron';

// Helper function to get the correct DLL path
function getDllPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'dlls', 'GamepadAPI.dll');
  }
  return path.join(app.getAppPath(), 'dlls', 'GamepadAPI.dll');
}

const gamepadLib = koffi.load(getDllPath());

koffi.struct('Gamepad_Result', {
  status: 'int',
  error: 'uint32' 
});

// System Functions
const system = {
  initialize: gamepadLib.func('Gamepad_Result initialize()'),
  release_gamepad: gamepadLib.func('Gamepad_Result release_gamepad(int id)'),
  release_all: gamepadLib.func('Gamepad_Result release_all()'),
}

// Xbox Controller Functions
const xbox = {
  create: gamepadLib.func('Gamepad_Result create_xbox_controller(int* id)'),
  input_up: gamepadLib.func('Gamepad_Result xbox_input_up(int id, bool keydown)'),
  input_down: gamepadLib.func('Gamepad_Result xbox_input_down(int id, bool keydown)'),
  input_left: gamepadLib.func('Gamepad_Result xbox_input_left(int id, bool keydown)'),
  input_right: gamepadLib.func('Gamepad_Result xbox_input_right(int id, bool keydown)'),

  input_a: gamepadLib.func('Gamepad_Result xbox_input_a(int id, bool keydown)'),
  input_b: gamepadLib.func('Gamepad_Result xbox_input_b(int id, bool keydown)'),
  input_x: gamepadLib.func('Gamepad_Result xbox_input_x(int id, bool keydown)'),
  input_y: gamepadLib.func('Gamepad_Result xbox_input_y(int id, bool keydown)'),

  input_lb: gamepadLib.func('Gamepad_Result xbox_input_lb(int id, bool keydown)'),
  input_rb: gamepadLib.func('Gamepad_Result xbox_input_rb(int id, bool keydown)'),
  input_lt: gamepadLib.func('Gamepad_Result xbox_input_lt(int id, int val)'),
  input_rt: gamepadLib.func('Gamepad_Result xbox_input_rt(int id, int val)'),

  input_left_stick: gamepadLib.func('Gamepad_Result xbox_input_left_stick(int id, short x, short y)'),
  input_right_stick: gamepadLib.func('Gamepad_Result xbox_input_right_stick(int id, short x, short y)'),
  input_left_analog_button: gamepadLib.func('Gamepad_Result xbox_input_left_analog_button(int id, bool keydown)'),
  input_right_analog_button: gamepadLib.func('Gamepad_Result xbox_input_right_analog_button(int id, bool keydown)'),

  input_start: gamepadLib.func('Gamepad_Result xbox_input_start(int id, bool keydown)'),
  input_back: gamepadLib.func('Gamepad_Result xbox_input_back(int id, bool keydown)'),
  input_guide: gamepadLib.func('Gamepad_Result xbox_input_guide(int id, bool keydown)'),
};

// DualShock 4 Controller Functions
const dualshock4 = {
  create: gamepadLib.func('Gamepad_Result create_dualshock4_controller(int* id)'),
  
  input_up: gamepadLib.func('Gamepad_Result ds4_input_up(int id, bool keydown)'),
  input_down: gamepadLib.func('Gamepad_Result ds4_input_down(int id, bool keydown)'),
  input_left: gamepadLib.func('Gamepad_Result ds4_input_left(int id, bool keydown)'),
  input_right: gamepadLib.func('Gamepad_Result ds4_input_right(int id, bool keydown)'),

  input_up_left: gamepadLib.func('Gamepad_Result ds4_input_up_left(int id, bool keydown)'),
  input_up_right: gamepadLib.func('Gamepad_Result ds4_input_up_right(int id, bool keydown)'),
  input_down_left: gamepadLib.func('Gamepad_Result ds4_input_down_left(int id, bool keydown)'),
  input_down_right: gamepadLib.func('Gamepad_Result ds4_input_down_right(int id, bool keydown)'),

  input_square: gamepadLib.func('Gamepad_Result ds4_input_square(int id, bool keydown)'),
  input_triangle: gamepadLib.func('Gamepad_Result ds4_input_triangle(int id, bool keydown)'),
  input_circle: gamepadLib.func('Gamepad_Result ds4_input_circle(int id, bool keydown)'),
  input_cross: gamepadLib.func('Gamepad_Result ds4_input_cross(int id, bool keydown)'),

  input_left_stick: gamepadLib.func('Gamepad_Result ds4_input_left_stick(int id, short x, short y)'),
  input_right_stick: gamepadLib.func('Gamepad_Result ds4_input_right_stick(int id, short x, short y)'),
  
  input_l1: gamepadLib.func('Gamepad_Result ds4_input_l1(int id, bool keydown)'),
  input_r1: gamepadLib.func('Gamepad_Result ds4_input_r1(int id, bool keydown)'),
  input_l2: gamepadLib.func('Gamepad_Result ds4_input_l2(int id, int val)'),
  input_r2: gamepadLib.func('Gamepad_Result ds4_input_r2(int id, int val)'),
  input_l3: gamepadLib.func('Gamepad_Result ds4_input_l3(int id, bool keydown)'),
  input_r3: gamepadLib.func('Gamepad_Result ds4_input_r3(int id, bool keydown)'),

  input_share: gamepadLib.func('Gamepad_Result ds4_input_share(int id, bool keydown)'),
  input_options: gamepadLib.func('Gamepad_Result ds4_input_options(int id, bool keydown)'),
  input_touchpad: gamepadLib.func('Gamepad_Result ds4_input_touchpad(int id, bool keydown)'),
  input_ps: gamepadLib.func('Gamepad_Result ds4_input_ps(int id, bool keydown)'),
};

export {
  system,
  xbox,
  dualshock4,
};
import koffi from 'koffi';
import path from 'path';
const { app } = require('electron');

const gamepadLib = koffi.load(path.resolve(app.getAppPath(), 'dlls/GamepadAPI.dll'));

koffi.struct('Gamepad_Result', {
  status: 'int',
  error: 'uint32' 
});

// System Functions
const system = {
  initialize: gamepadLib.func('Gamepad_Result initialize()'),
  release: gamepadLib.func('Gamepad_Result release()'),
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



export {
  system,
  xbox,
};

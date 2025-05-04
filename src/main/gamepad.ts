import { v4 as uuidv4 } from 'uuid';
import { GamepadType } from '../shared/enums'; 

export class Gamepad {
  uuid: string;
  type: GamepadType;

  constructor(type: GamepadType) {
    this.uuid = uuidv4();
    this.type = type;
  }
}
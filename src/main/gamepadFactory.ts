import { GamepadType } from '../shared/enums'; 
import { xbox, dualshock4 } from './ffi';

async function createGamepad(type: GamepadType): Promise<number> {
    const idBuffer = Buffer.alloc(4);

    if (type === GamepadType.GAMEPAD_XBOX360) {
        await xbox.create(idBuffer);
    }
    else if (type === GamepadType.GAMEPAD_DUALSHOCK4) {
        await dualshock4.create(idBuffer);
    } else {
        throw new Error(`Unsupported gamepad type: ${type}`);
    }

    const id = idBuffer.readInt32LE();
    
    return id;
}

export {
    createGamepad,
}
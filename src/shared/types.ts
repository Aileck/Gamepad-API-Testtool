 export type InputPayload = {
    isPressed?: boolean;
    stick?: { x: number; y: number };
    trigger?: number;
}

export type GamepadData = {
    buttonEast: boolean;
    buttonWest: boolean;
    buttonNorth: boolean;
    buttonSouth: boolean;

    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;

    leftShoulder: boolean;
    rightShoulder: boolean;

    leftTrigger: boolean;
    rightTrigger: boolean;

    leftStickButton: boolean;
    rightStickButton: boolean;

    // Unit vector2
    leftStick: [number, number];  
    rightStick: [number, number];  

    buttonStart: boolean;
    buttonSelect: boolean;
}


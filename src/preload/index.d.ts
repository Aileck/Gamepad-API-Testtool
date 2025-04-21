import { ElectronAPI } from '@electron-toolkit/preload'

type Gamepad_Result = {
  status: number;
  error: number; 
};

type GamepadAPIResult = {
  content: number | string;
  error: string;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      initialize: () => Promise<Gamepad_Result>
      release: () => Promise<Gamepad_Result>
    
      create_xbox_controller: () => Promise<GamepadAPIResult>
      xbox_input: (id, input, payload) => Promise<Gamepad_Result>
    }  
  }
}

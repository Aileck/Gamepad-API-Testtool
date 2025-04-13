import { ElectronAPI } from '@electron-toolkit/preload'

type Gamepad_Result = {
  STATUS: number;
  error: number; 
};

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      initialize: () => Promise<Gamepad_Result>
      create_xbox_controller: () => Promise<Gamepad_Result>
      release: () => Promise<Gamepad_Result>
    
      xbox_down_dpad_controller: () => Promise<Gamepad_Result>
    }  
  }
}

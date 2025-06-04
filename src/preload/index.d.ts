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
      create_ds4_controller: () => Promise<GamepadAPIResult>

      awake_wss: () => Promise<void>
      get_server_ip: () => Promise<stirng>
      getMaxGamepads: () => Promise<number>
      write_to_log: (callback: (event: Event, message: string) => void) => void
      start_wss: (port: number) => Promise<void>
      stop_wss: () => Promise<void>

      onWindowCloseRequest: (callback: (event: Event) => void) => void
      confirmWindowClose: (shouldClose: boolean) => void
      minimizeWindow: () => void

      onGamepadRegistered: (callback: (event: Event, data: { clientId: number, gamepadType: string }) => void) => void
      onGamepadDisconnected: (callback: (event: Event, data: { id: number }) => void) => void
      onServerStatus: (callback: (event: Event, data: { status: string, error?: string }) => void) => void

      onXboxInput: (callback: (event: Event, data: { id: number, gamepadData: GamepadData }) => void) => void 
      onDualShockInput: (callback: (event: Event, data: { id: number, gamepadData: GamepadData }) => void) => void
      
      onGetDelay: (callback: (event: Event, data: { id: number, delay: number }) => void) => void
    }  
  }
}

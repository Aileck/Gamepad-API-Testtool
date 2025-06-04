import { contextBridge, ipcRenderer  } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  initialize: () => ipcRenderer.invoke('dll:initialize'),
  release: () => ipcRenderer.invoke('dll:release'),

  create_xbox_controller: () => ipcRenderer.invoke('dll:create_xbox_controller'),  
  create_ds4_controller: () => ipcRenderer.invoke('dll:create_ds4_controller'),
  awake_wss: () => ipcRenderer.invoke('wss:awake'),
  get_server_ip: () => ipcRenderer.invoke('wss:get_server_ip'),
  getMaxGamepads: () => ipcRenderer.invoke('get:max-gamepads'),
  
  start_wss: (port: number) => ipcRenderer.send('wss:start', port),
  stop_wss: () => ipcRenderer.send('wss:stop'),

  onWindowCloseRequest: (callback: (event: Electron.IpcRendererEvent) => void) => 
    ipcRenderer.on('window:close-request', callback),
  
  confirmWindowClose: (shouldClose: boolean) => ipcRenderer.send('window:close-confirm', shouldClose),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),

  write_to_log: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => 
    ipcRenderer.on('write-log', callback),
    
  onGamepadRegistered: (callback: (event: Electron.IpcRendererEvent, data: { clientId: number, gamepadType: string }) => void) =>
    ipcRenderer.on('gamepad:registered', callback),

  onServerStatus: (callback: (event: Electron.IpcRendererEvent, data: { status: string, error?: string }) => void) =>
    ipcRenderer.on('server-status', callback),

  onXboxInput: (callback: (event: Electron.IpcRendererEvent, data: { id: number, gamepadData: any }) => void) => {
    ipcRenderer.on('gamepad:input-xbox', callback);
  },

  onDualShockInput: (callback: (event: Electron.IpcRendererEvent, data: { id: number, gamepadData: any }) => void) => {
    ipcRenderer.on('gamepad:input-dualshock', callback);
  },

  onGetDelay: (callback: (event: Electron.IpcRendererEvent, data: { id: number, delay: number }) => void) => {
    ipcRenderer.on('gamepad:get-delay', callback);
  },

  onGamepadDisconnected: (callback: (event: Electron.IpcRendererEvent, data: { id: number }) => void) => {
    ipcRenderer.on('gamepad:disconnected', callback);
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

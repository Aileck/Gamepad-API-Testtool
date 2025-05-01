import { contextBridge, ipcRenderer  } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { XboxInput, DS4Input } from '../shared/enums'
import { InputPayload } from '../shared/types'

// Custom APIs for renderer
const api = {
  initialize: () => ipcRenderer.invoke('dll:initialize'),
  release: () => ipcRenderer.invoke('dll:release'),

  create_xbox_controller: () => ipcRenderer.invoke('dll:create_xbox_controller'),
  xbox_input: (gamepadID: number, input: XboxInput, payload: InputPayload) => ipcRenderer.invoke('dll:xbox_input', gamepadID, input, payload),
  
  create_ds4_controller: () => ipcRenderer.invoke('dll:create_ds4_controller'),
  ds4_input: (gamepadID: number, input: DS4Input, payload: InputPayload) => ipcRenderer.invoke('dll:ds4_input', gamepadID, input, payload),

  awake_wss: () => ipcRenderer.invoke('wss:awake'),
  get_server_ip: () => ipcRenderer.invoke('wss:get_server_ip'),
  
  start_wss: (port: number) => ipcRenderer.send('wss:start', port),
  stop_wss: () => ipcRenderer.send('wss:stop'),

  get_message: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => 
    ipcRenderer.on('message-received', callback),
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

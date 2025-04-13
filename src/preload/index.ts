import { contextBridge, ipcRenderer  } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  initialize: () => ipcRenderer.invoke('dll:initialize'),
  create_xbox_controller: () => ipcRenderer.invoke('dll:create_xbox_controller'),
  release: () => ipcRenderer.invoke('dll:release'),

  xbox_down_dpad_controller: () => ipcRenderer.invoke('dll:xbox_down_dpad_controller'),
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

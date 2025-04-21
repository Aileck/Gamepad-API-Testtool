import { contextBridge, ipcRenderer  } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { XboxInput } from '../shared/enums'
import { XboxInputPayload } from '../shared/types'

// Custom APIs for renderer
const api = {
  initialize: () => ipcRenderer.invoke('dll:initialize'),
  create_xbox_controller: () => ipcRenderer.invoke('dll:create_xbox_controller'),

  release: () => ipcRenderer.invoke('dll:release'),

  xbox_input: (gamepadID: number, input: XboxInput, payload: XboxInputPayload) => ipcRenderer.invoke('dll:xbox_input', gamepadID, input, payload),
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

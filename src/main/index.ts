import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

import { initWebSocketManager } from './websocket'

import { GamepadType } from '../shared/enums'

import icon from '../../resources/icon.png?asset'
import { system } from './ffi';

import { initializeGamepadSystem, createGamepad } from './gamepadFactory'
import { getClientMap } from './websocket'


const MAX_GAMEPADS = 4;

type Payload ={
  content: number | string;
  error: string;
}

let mainWindow : BrowserWindow | null = null;
let hasAskedToClose = false;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    show: false,
    minimizable: true,
    maximizable: true,
    resizable: true,
    closable: true,
    focusable: true,
    autoHideMenuBar: true,
    frame: true,
    title: 'Phone2Pad Desktop Preview',

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Remove the menu bar completely
  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (e) => {
    const clientMap = getClientMap()
    console.log(clientMap.size);
    
    // 无论有没有客户端连接，都显示确认对话框
    if (!hasAskedToClose) {
      e.preventDefault()
      mainWindow?.webContents.send('window:close-request')
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 添加窗口关闭确认和最小化的事件处理
  ipcMain.on('window:close-confirm', (_, shouldClose) => {
    if (shouldClose) {
      hasAskedToClose = true
      mainWindow?.close()
    }
  })

  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize()
    hasAskedToClose = false
  })

  // IPC test

  ipcMain.handle('dll:initialize', async() => {
    const result = await initializeGamepadSystem();
    // mainWindow?.setFocusable(false);
    mainWindow?.setAlwaysOnTop(true, 'screen-saver', 1);
    return result;
  });

  ipcMain.handle('get:max-gamepads', () => {
    return MAX_GAMEPADS;
  });

  ipcMain.handle('dll:create_xbox_controller', async() => {
    const gamepadId = await createGamepad(GamepadType.Xbox);

    const payload: Payload = {
      content: gamepadId,
      error: ''
    };
    mainWindow?.setFocusable(false);
    return payload;
  });

  ipcMain.handle('dll:create_ds4_controller', async() => {
    const gamepadId = await createGamepad(GamepadType.DualShock);

    const payload: Payload = {
      content: gamepadId,
      error: ''
    };
    return payload;
  });

  ipcMain.handle('dll:release', async() => {
    const result = await system.release_all();

    mainWindow?.setFocusable(true);
    mainWindow?.setAlwaysOnTop(false, 'screen-saver', 1);

    return result;
  });

  ipcMain.handle('wss:awake', async() => {
    if (mainWindow) {
      initWebSocketManager(mainWindow);
    }
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

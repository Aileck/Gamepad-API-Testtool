import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import path from 'path';
import koffi from 'koffi';

const gamepad  = koffi.load(path.join(process.cwd(), 'dlls/GamepadInputSDK.dll')); 

// @ts-ignore
const Gamepad_Result = koffi.struct('Gamepad_Result', {
  STATUS: 'int',
  error: 'uint32' 
});

const initialize = gamepad.func('Gamepad_Result initialize()',);

const create_xbox_controller = gamepad.func('Gamepad_Result create_xbox_controller(int* id)');
const release = gamepad.func('Gamepad_Result release()');
const xbox_down_dpad_controller = gamepad.func('Gamepad_Result xbox_down_dpad_controller(int id)');

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
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
  let controllerID = -1;

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('dll:initialize', async() => {
    const result = await initialize();
    console.log(result);
    return result; 
  });

  ipcMain.handle('dll:create_xbox_controller', async() => {
    const idBuffer = Buffer.alloc(4); 

    const result = await create_xbox_controller(controllerID);

    const id = idBuffer.readInt32LE();

    controllerID = id;
    console.log('返回结果:', result);
    console.log('控制器 ID:', id);
    
    console.log(result);
    return result; 
  });

  ipcMain.handle('dll:xbox_down_dpad_controller', async() => {
    const result = await xbox_down_dpad_controller(controllerID);

    return result; 
  });

  ipcMain.handle('dll:release', async() => {
    const result = await release();
    console.log(result);
    return result; 
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

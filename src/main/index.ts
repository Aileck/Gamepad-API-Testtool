import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { XboxInput } from '../shared/enums'
import { XboxInputPayload } from '../shared/types'

import icon from '../../resources/icon.png?asset'
// @ts-ignore
import { system, xbox } from './ffi';


type Payload ={
  content: number | string;
  error: string;
}

let mainWindow : BrowserWindow | null = null;
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,            
    minimizable: true,
    maximizable: true,
    resizable: true,
    closable: true,
    focusable: true,    

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
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
    const result = await system.initialize();

    return result; 
  });

  ipcMain.handle('dll:create_xbox_controller', async() => {
    const idBuffer = Buffer.alloc(4); 

    await xbox.create(idBuffer);

    const id = idBuffer.readInt32LE();

    controllerID = id;
    
    mainWindow?.setFocusable(false);
    // mainWindow?.showInactive();
    
    const payload: Payload = {
      content: controllerID,
      error: ''
    };
    
    return payload; 
  });

  ipcMain.handle('dll:xbox_input', async (_, gamepadID: number, input: XboxInput, inputPayload: XboxInputPayload) => {
    let result;

    switch (input) {
      case XboxInput.A:
        result = await xbox.input_a(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.B:
        console.log(inputPayload);

        result = await xbox.input_b(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.X:
        result = await xbox.input_x(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.Y:
        result = await xbox.input_y(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.UP:
        result = await xbox.input_up(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.DOWN:
        result = await xbox.input_down(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LEFT:
        result = await xbox.input_left(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RIGHT:
        result = await xbox.input_right(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LB:
        result = await xbox.input_lb(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RB:
        result = await xbox.input_rb(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.LT:
        result = await xbox.input_lt(gamepadID, inputPayload.trigger);
        break;
      case XboxInput.RT:
        result = await xbox.input_rt(gamepadID, inputPayload.trigger);
        break;
      case XboxInput.LEFT_STICK:
        result = await xbox.input_left_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case XboxInput.RIGHT_STICK:
        result = await xbox.input_right_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case XboxInput.LSB:
        result = await xbox.input_left_analog_button(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.RSB:
        result = await xbox.input_right_analog_button(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.BACK:
        result = await xbox.input_back(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.START:
        result = await xbox.input_start(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.GUIDE:
        result = await xbox.input_guide(gamepadID, inputPayload.isPressed);
        break;
      default:
        throw new Error('Invalid XboxInput');
    }

    return result;
  });

  ipcMain.handle('dll:release', async() => {
    const result = await system.release();
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

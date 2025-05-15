import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import { initWebSocketManager } from './websocket'

import { XboxInput, DS4Input } from '../shared/enums'
import { InputPayload } from '../shared/types'

import icon from '../../resources/icon.png?asset'
import { system, xbox, dualshock4 } from './ffi';

import { initializeGamepadSystem, createGamepad } from './gamepadFactory'


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

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Ignore certificate errors
    // This is not recommended for production apps
    
    event.preventDefault();
    callback(true);
  });

  // IPC test

  ipcMain.handle('dll:initialize', async() => {
    const result = await initializeGamepadSystem();
    // mainWindow?.setFocusable(false);
    mainWindow?.setAlwaysOnTop(true, 'screen-saver', 1);
    return result;
  });

  ipcMain.handle('dll:create_xbox_controller', async() => {
    const gamepadId = await createGamepad("GAMEPAD_XBOX360");

    const payload: Payload = {
      content: gamepadId,
      error: ''
    };
    mainWindow?.setFocusable(false);
    return payload;
  });

  ipcMain.handle('dll:xbox_input', async (_, gamepadID: number, input: XboxInput, inputPayload: InputPayload) => {
    let result;

    switch (input) {
      case XboxInput.A:
        result = await xbox.input_a(gamepadID, inputPayload.isPressed);
        break;
      case XboxInput.B:

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

  ipcMain.handle('dll:create_ds4_controller', async() => {
    const gamepadId = await createGamepad("GAMEPAD_DUALSHOCK4");

    const payload: Payload = {
      content: gamepadId,
      error: ''
    };
    return payload;
  });

  ipcMain.handle('dll:ds4_input', async (_, gamepadID: number, input: DS4Input, inputPayload: InputPayload) => {
    let result;

    switch (input) {
      case DS4Input.CROSS:
        result = await dualshock4.input_cross(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.CIRCLE:
        result = await dualshock4.input_circle(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.SQUARE:
        result = await dualshock4.input_square(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.TRIANGLE:
        result = await dualshock4.input_triangle(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.UP:
        result = await dualshock4.input_up(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.DOWN:
        result = await dualshock4.input_down(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.LEFT:
        result = await dualshock4.input_left(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.RIGHT:
        result = await dualshock4.input_right(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.UP_LEFT:
        result = await dualshock4.input_up_left(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.UP_RIGHT:
        result = await dualshock4.input_up_right(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.DOWN_LEFT:
        result = await dualshock4.input_down_left(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.DOWN_RIGHT:
        result = await dualshock4.input_down_right(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.L1:
        result = await dualshock4.input_l1(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.R1:
        result = await dualshock4.input_r1(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.L2:
        result = await dualshock4.input_l2(gamepadID, inputPayload.trigger);
        break;
      case DS4Input.R2:
        result = await dualshock4.input_r2(gamepadID, inputPayload.trigger);
        break;
      case DS4Input.L3:
        result = await dualshock4.input_l3(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.R3:
        result = await dualshock4.input_r3(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.LEFT_STICK:
        result = await dualshock4.input_left_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case DS4Input.RIGHT_STICK:
        result = await dualshock4.input_right_stick(
          gamepadID,
          inputPayload.stick?.x,
          inputPayload.stick?.y,
        );
        break;
      case DS4Input.SHARE:
        result = await dualshock4.input_share(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.OPTIONS:
        result = await dualshock4.input_options(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.TOUCHPAD:
        result = await dualshock4.input_touchpad(gamepadID, inputPayload.isPressed);
        break;
      case DS4Input.PS:
        result = await dualshock4.input_ps(gamepadID, inputPayload.isPressed);
        break;
      default:
        throw new Error('Invalid DS4Input');
    }
    return result;
  });

  ipcMain.handle('dll:release', async() => {
    const result = await system.release();

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

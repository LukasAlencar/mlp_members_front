import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process';
import log from 'electron-log'

// let backendProcess;

// function startBackend() {
//   const isDev = !app.isPackaged
//   log.info(`Iniciando backend em: ${isDev ? 'desenvolvimento' : 'produção'}`)

//   const backendPath = isDev ? join(__dirname, '../../backend/build/src/index.js') : join(process.resourcesPath, 'backend', 'build/src/index.js');

//   log.info(`Backend path: ${backendPath}`)

//   console.log(`Iniciando backend em: ${backendPath}`);

//   backendProcess = spawn('node', [backendPath], {
//     stdio: ['ignore', 'pipe', 'pipe'],
//     detached: false
//   });

//   backendProcess.stdout.on('data', (data) => {
//     console.log(`Backend: ${data}`);
//     log.info(`Backend: ${data}`);

//   });

//   backendProcess.stderr.on('data', (data) => {
//     console.error(`Erro no backend: ${data}`);
//     log.info(`Erro Backend: ${data}`);

//   });
// }

// function stopBackend() {
//   if (backendProcess) {
//     console.log('Encerrando backend...');
//     log.info(`Encerrando backend...`);
//     backendProcess.kill('SIGTERM');
//     backendProcess = null;
//   }
// }

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    maximizable: true,
    icon: join(__dirname, '../../resources/icon.ico'),
    title: 'MLP Membros',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    // startBackend();

    mainWindow.maximize()
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
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.mlpmembers')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

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
    // stopBackend();
    app.quit()
  }

})

// app.on('quit', () => {
  // stopBackend();
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

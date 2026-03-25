//src/main/index.js

import { app, shell, BrowserWindow } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process';
import log from 'electron-log'
import fs from "fs";
import kill from "tree-kill";
import { autoUpdater } from 'electron-updater'

let backendProcess;
let backendStarted = false;

Object.assign(console, log.functions);

log.transports.file.resolvePathFn = () =>
  path.join(app.getPath("userData"), "logs/main.log");

async function runMigrations(dbPath) {
  return new Promise((resolve, reject) => {
    const backendDir = app.isPackaged
      ? path.join(process.resourcesPath, 'backend')
      : path.join(__dirname, '..', '..', 'backend')

    const schemaPath = path.join(backendDir, 'prisma', 'schema.prisma')

    const env = Object.assign({}, process.env, {
      DATABASE_URL: `file:${dbPath}`,
      ELECTRON_RUN_AS_NODE: '1'
    })

    // Caminho do binário do prisma dentro do node_modules empacotado
    const isWin = process.platform === 'win32'
    const prismaBin = app.isPackaged
      ? path.join(backendDir, 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma')
      : path.join(backendDir, 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma')

    log.info('Prisma bin path:', prismaBin)

    const migrateProcess = spawn(`"${prismaBin}"`, ['migrate', 'deploy', '--schema', `"${schemaPath}"`], {
      env,
      cwd: backendDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      windowsHide: true,
      shell: isWin // No Windows, precisa de shell para .cmd funcionar
    })

    let errorOutput = ''

    migrateProcess.stdout.on('data', (data) => log.info(`[Prisma] ${data.toString().trim()}`))
    migrateProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
      log.error(`[Prisma Error] ${data.toString().trim()}`)
    })

    migrateProcess.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Migration failed (code ${code}): ${errorOutput}`))
    })

    migrateProcess.on('error', reject)
  })
}

async function createAdmin() {
  return new Promise((resolve, reject) => {
    const backendDir = app.isPackaged
      ? path.join(process.resourcesPath, "backend")
      : path.join(__dirname, "..", "..", "backend");

    const createAdminScript = path.join(backendDir, "scripts", "create-admin.js");

    log.info("Criando usuário admin...");
    log.info("Script path:", createAdminScript);

    // Configurar environment
    const env = Object.assign({}, process.env, {
      DATABASE_URL: `file:${ensureWritableDb()}`,
      // 👇 IMPORTANTE: Força execução como Node
      ELECTRON_RUN_AS_NODE: "1"
    });

    const adminProcess = spawn(process.execPath, [createAdminScript], {
      env,
      cwd: backendDir,
      stdio: ["inherit", "pipe", "pipe"], // 👈 MUDOU AQUI
      windowsHide: true // 👈 IMPORTANTE: Não mostra janela no Windows
    });

    let output = "";
    let errorOutput = "";

    adminProcess.stdout.on("data", (data) => {
      const message = data.toString();
      output += message;
      log.info(`[Create Admin] ${message.trim()}`);
    });

    adminProcess.stderr.on("data", (data) => {
      const message = data.toString();
      errorOutput += message;
      log.error(`[Create Admin Error] ${message.trim()}`);
    });

    adminProcess.on("close", (code) => {
      if (code === 0) {
        log.info("Usuário admin criado/verificado com sucesso!");
        resolve(output);
      } else {
        log.error("Erro ao criar admin:", errorOutput);
        reject(new Error(`Create admin failed with code ${code}: ${errorOutput}`));
      }
    });

    adminProcess.on("error", (error) => {
      log.error("Erro ao iniciar processo de criação de admin:", error);
      reject(error);
    });
  });
}

async function initializeDatabase() {
  const dbPath = ensureWritableDb();

  try {
    // Só executa migrations em produção OU se o banco não existir em dev
    if (app.isPackaged || !fs.existsSync(dbPath)) {
      log.info("Inicializando banco de dados...");

      // 1. Executar migrations
      await runMigrations(dbPath);

      // 2. Criar usuário admin
      await createAdmin();

      log.info("Banco de dados inicializado com sucesso!");
    } else {
      log.info("Banco de dados já existe em desenvolvimento, pulando inicialização");
    }
  } catch (error) {
    log.error("Erro ao inicializar banco de dados:", error);
    // Você pode decidir se quer continuar ou abortar a aplicação
    throw error;
  }
}

async function startBackend() {
  if (backendStarted) return;
  backendStarted = true;

  try {
    // Inicializar banco antes de iniciar backend
    await initializeDatabase();

    const dbPath = ensureWritableDb();
    log.info("dbPath do startBackend: " + dbPath)
    const backendEntry = getBackendPath();
    log.info("backendEntry do startBackend: " + backendEntry)

    const env = Object.assign({}, process.env, {
      DATABASE_URL: `file:${dbPath}`,
      // 👇 IMPORTANTE: Força execução como Node
      ELECTRON_RUN_AS_NODE: "1"
    });

    // 👇 USAR SPAWN AO INVÉS DE FORK
    backendProcess = spawn(process.execPath, [backendEntry], {
      env,
      cwd: app.isPackaged ? path.join(process.resourcesPath, "backend") : path.join(__dirname, "..", "..", "backend"),
      stdio: ["inherit", "pipe", "pipe"], // 👈 MUDOU AQUI
      windowsHide: true // 👈 IMPORTANTE: Não mostra janela no Windows
    });

    log.info("Backend iniciado. PID:", backendProcess.pid);

    // logs do backend
    backendProcess.stdout.on("data", (data) => {
      log.info(`[backend stdout] ${data.toString().trim()}`);
    });

    backendProcess.stderr.on("data", (data) => {
      log.error(`[backend stderr] ${data.toString().trim()}`);
    });

    backendProcess.on("exit", (code, signal) => {
      console.log("backend saiu:", code, signal);
    });

  } catch (error) {
    log.error("Erro ao inicializar aplicação:", error);
    app.quit();
  }
}

function stopBackend() {
  if (backendProcess) {
    log.info("Encerrando backend... PID:" + backendProcess.pid);
    kill(backendProcess.pid, "SIGTERM", (err) => {
      if (err) log.error("Erro ao encerrar backend:", err);
      else log.info("Backend encerrado com sucesso");
    });
    backendProcess = null;
  }
}



function ensureWritableDb() {
  log.info("Producao: " + app.isPackaged)

  if (!app.isPackaged) {
    return path.join(__dirname, "..", "..", "backend", "prisma", "dev.db");
  }

  const userData = app.getPath("userData");
  const dbDest = path.join(userData, "prod.db");

  log.info("dbDest: " + dbDest)

  if (!fs.existsSync(path.dirname(dbDest))) {
    fs.mkdirSync(path.dirname(dbDest), { recursive: true });
  }

  return dbDest;
}

function getBackendPath() {
  if (!app.isPackaged) {
    // dev: assume backend/dist/index.js na raiz do projeto (quando rodando em dev)
    return path.join(__dirname, "..", "..", "backend", "dist", "index.js");
  } else {
    // prod: backend foi copiado para resources/backend/dist/index.js
    return path.join(process.resourcesPath, "backend", "dist", "index.js");
  }
}

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

  if (app.isPackaged) {
    try {
      autoUpdater.requestHeaders = {
        Authorization: `token ${import.meta.env.VITE_GH_TOKEN}`
      }
      autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      log.error('Erro ao verificar updates:', error)
    }
  }

  startBackend();

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

autoUpdater.on('error', (error) => {
  log.error('AutoUpdater error:', error)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit()
  }

})


autoUpdater.on('update-downloaded', () => {
  // instala na próxima vez que fechar, ou force agora:
  autoUpdater.quitAndInstall()
})
// app.on('quit', () => {
// stopBackend();
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

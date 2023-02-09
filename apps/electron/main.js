const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  Tray,
  dialog,
  ipcMain,
  shell,
  Notification,
} = require('electron');
const path = require('path');
const electronConfig = require('./electron.config');

const env = process.env.NODE_ENV || 'production';
const isProduction = env === 'production';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// path to server
const nodePath = path.join('file://', __dirname, '../', 'server/index.cjs')

if (!isProduction || true) {
  console.log(`Electron running in ${env} environment`);
  console.log(`Ontime server at ${nodePath} `);
  process.traceProcessWarnings = true;
}

// path to icons
const trayIcon = path.join(__dirname, './assets/background.png');
const appIcon = path.join(__dirname, './assets/logo.png');
let loaded = 'Nothing loaded';
let isQuitting = false;

// initialise
let win;
let splash;
let tray = null;

(async () => {

  // in dev mode, we expect both UI and server to be running
  if (!isProduction)  {
    return
  }

  try {
    // const loadDepPath = isProduction
    //   ? path.join('file://', __dirname, '../', 'server/src/modules/loadDb.js')
    //   : path.join('file://', __dirname, '../server/src/modules/loadDb.js');
    // console.log('DB PATH = ', loadDepPath)
    //
    // // TODO: should this should be handled by process, not consumer
    // const dbLoader = await import(loadDepPath);

    // await dbLoader.promise;
    const { startServer, startOSCServer } = await import(nodePath);
    // Start express server
    loaded = await startServer();

    // Start OSC Server
    await startOSCServer();
  } catch (error) {
    loaded = error;
  }
  console.log('initiated status: ', loaded)
})();

/**
 * @description utility function to create a notification
 * @param title
 * @param text
 */
function showNotification(title, text) {
  new Notification({
    title,
    body: text,
    silent: true,
  }).show();
}

function appShutdown() {
  // terminate node service
  (async () => {
    const { shutdown } = await import(nodePath);
    await shutdown();
  })();

  isQuitting = true;
  tray.destroy();
  win.destroy();
  app.quit();
}

function askToQuit() {
  win.show();
  win.focus();
  win.send('user-request-shutdown');
}

// Ensure there isn't another instance of the app running already
const lock = app.requestSingleInstanceLock();
if (!lock) {
  dialog.showErrorBox('Multiple instances', 'An instance if the App is already running.');
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });
}

function createWindow() {
  splash = new BrowserWindow({
    width: 333,
    height: 333,
    transparent: true,
    icon: appIcon,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    focusable: false,
    skipTaskbar: true,
  });
  splash.setIgnoreMouseEvents(true);
  splash.loadURL(`file://${__dirname}/src/splash/splash.html`);

  win = new BrowserWindow({
    width: 1920,
    height: 1000,
    minWidth: 525,
    minHeight: 405,
    maxWidth: 1920,
    maxHeight: 1440,
    backgroundColor: '#101010', // $gray-1350
    icon: appIcon,
    show: false,
    textAreasAreResizable: false,
    enableWebSQL: false,
    darkTheme: true,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.setMenu(null);
}

app.disableHardwareAcceleration();
app.whenReady().then(() => {
  // Set app title in windows
  if (isWindows) {
    app.setAppUserModelId(app.name);
  }

  createWindow();

  // register global shortcuts
  // (available regardless of whether app is in focus)
  // bring focus to window
  globalShortcut.register('Alt+1', () => {
    win.show();
    win.focus();
  });

  // give the nodejs server some time
  setTimeout(() => {
    // Load page served by node
    const clientUrl = isProduction
      ? electronConfig.reactAppUrl.production
      : electronConfig.reactAppUrl.development;

    win.loadURL(clientUrl).then(() => {
      win.webContents.setBackgroundThrottling(false);

      win.show();
      win.focus();

      splash.destroy();

      if (typeof loaded === 'string') {
        tray.setToolTip(loaded);
      } else {
        tray.setToolTip('Initialising error: please restart ontime');
      }
    });
  }, electronConfig.appIni.mainWindowWait);

  // recreate window if no others open
  app.on('activate', () => {
    win.show();
  });

  // Hide on close
  win.on('close', function (event) {
    event.preventDefault();
    if (!isQuitting) {
      showNotification('Window Closed', 'App running in background');
      win.hide();
    }
  });

  // create tray
  tray = new Tray(trayIcon);

  // Define context menu
  const { getTrayMenu } = require('./src/menu/trayMenu.js');
  const trayMenuTemplate = getTrayMenu(bringToFront, askToQuit)
  const trayContextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setContextMenu(trayContextMenu);
});

const { getApplicationMenu } = require('./src/menu/applicationMenu.js');
const template = getApplicationMenu(isMac, askToQuit)
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// unregister shortcuts before quitting
app.once('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Get messages from react
// Test message
ipcMain.on('test-message', (event, arg) => {
  showNotification('Test Message', 'test from react', arg);
});

// Ask for main window reload
// Test message
ipcMain.on('reload', () => {
  if (win) {
    win.reload();
  }
});

// Terminate
ipcMain.on('shutdown', () => {
  console.log('Got IPC shutdown');
  appShutdown();
});

// Window manipulation
ipcMain.on('set-window', (event, arg) => {
  console.log('Got IPC set-window', arg);

  if (arg === 'to-max') {
    // window full
    win.maximize();
  } else if (arg === 'to-tray') {
    // window to tray
    win.hide();
  } else if (arg === 'show-dev') {
    // Show dev tools
    win.webContents.openDevTools({ mode: 'detach' });
  }
});

// Open links external
ipcMain.on('send-to-link', (event, arg) => {
  console.log('Got IPC send-to-link', arg);

  // send to help URL
  if (arg === 'help') {
    shell.openExternal(electronConfig.externalUrls.help);
  } else {
    shell.openExternal(arg);
  }
});

'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
var appIcon = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 0, height: 0, skipTaskbar: true});
  app.dock.hide();

  appIcon = new Tray('guitar.png');
  var contextMenu = Menu.buildFromTemplate([
      { label: 'Quit', click: function() { app.quit(); } }
  ]);
  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip('6 Music Player');
  appIcon.setTitle('6 Music');

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  let webContents = mainWindow.webContents;
  mainWindow.minimize();

  var playing = true;
  var ret = globalShortcut.register('MediaPlayPause', function() {
    if (playing) {
      webContents.send('pause');
      playing = false;
    } else {
      webContents.send('play');
      playing = true;
    }
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    globalShortcut.unregisterAll();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

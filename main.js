const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({useContentSize:true, width:1920, height:1080, maxWidth:1920, maxHeight:1080});

  // Open Development Tools
  mainWindow.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});

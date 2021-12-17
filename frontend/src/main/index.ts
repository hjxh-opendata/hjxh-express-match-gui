import { BrowserWindow, app } from "electron";
import path from "path";

let win: BrowserWindow | null = null;

let dev = true;  // enable electron-react-devtools

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'DEVTRON'
  ]

  return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .catch(console.log)
}


function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // win.webContents.openDevTools();
  const isDevelopment = process.env.NODE_ENV === "development";
  if(isDevelopment)
    win.loadURL("http://localhost:8080");
  else
    win.loadFile(path.join(__dirname, "../../dist/index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('ready', async () => {
    if (dev && process.argv.indexOf('--noDevServer') === -1) {
      await installExtensions()
    }
    createWindow()
  })

  app.on("window-all-closed", app.quit);
});

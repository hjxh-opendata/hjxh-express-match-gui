import { BrowserWindow, app } from "electron";
import path from "path";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

let win: BrowserWindow | null = null;

let dev = true; // enable electron-react-devtools

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // win.webContents.openDevTools();
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) win.loadURL("http://localhost:8080").then();
  else win.loadFile(path.join(__dirname, "../../dist/index.html")).then();
}

app.whenReady().then(() => {
  // - [MarshallOfSound/electron-devtools-installer: An easy way to ensure Chrome DevTools extensions into Electron](https://github.com/MarshallOfSound/electron-devtools-installer)
  installExtension(REDUX_DEVTOOLS)
    .then((name) => {
      console.log(`Added Extension: ${name}`);
    })
    .catch((err) => console.log(err));

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => {
      console.log(`Added Extension: ${name}`);
    })
    .catch((err) => console.log(err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", app.quit);
});

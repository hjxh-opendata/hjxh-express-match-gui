import {app, BrowserWindow, ipcMain} from "electron";
import * as path from "path";
import {db} from "./db";
import {COLL_ITEMS_NAME} from "./config";
import {Msg} from "./const";

let win: BrowserWindow | null = null;

function createWindow() {
    console.log({__dirname})
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // contextBridge接口需要
            contextIsolation: true,
            // 尽管preload源文件是.ts，这里也要导入.js
            preload: path.join(__dirname, "preload.js")
        },
    });
    // win.webContents.openDevTools();
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment){
        win.loadURL("http://localhost:8080");
        // Open the DevTools.
        win.webContents.openDevTools();
    }
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

    app.on("window-all-closed", app.quit);
});


ipcMain.on(Msg.db_query_req, (event, {query, collName = COLL_ITEMS_NAME}) => {
    console.log({operation: Msg.db_query_req, collName, query})
    db.collection(collName).find(query).forEach(item => {
        console.log("sending queried item...")
        event.reply(Msg.db_query_res, item)
    })
})

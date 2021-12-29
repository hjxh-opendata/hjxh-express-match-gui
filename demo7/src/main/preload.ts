import { contextBridge, dialog } from "electron";


console.log("loading preload script")
contextBridge.exposeInMainWorld(
    'electronAPI',
    {
        readErps:async () => {
            const res  = await dialog.showOpenDialog({
                title:"ERP录入系统",
                message: "请选择要录入的ERP表（可多选）",
                buttonLabel: "确认上传",
                properties: [
                    "openFile",
                    "multiSelections",
                    "createDirectory"
                ],
                filters: [{
                    name: "ERP表必须是.csv格式",
                    extensions: ["csv"]
                }]
            })
            console.log(res)
        }
    }
)
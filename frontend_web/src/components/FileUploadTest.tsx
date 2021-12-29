import {Button} from "antd";
import axios, {URL_CheckFileInfo} from "../axios";

const TEST_FILE_PATH = "data/erp_11月旺店通数据5.csv"

export const FileUploadTest = () => {

    const onClickFileSubmit = async () => {
        const fmData = new FormData()
        // fmData.append("file", )
        let s = await axios.post(
            URL_CheckFileInfo, fmData, {
                params: {force_write: true},
                // 这个header很关键，不然服务端总会错
                // reference:  [How to use Fastapi to handle multiple files upload using axios - Johnnn](https://johnnn.tech/q/how-to-use-fastapi-to-handle-multiple-files-upload-using-axios/)
                headers: {"Content-Type": "multipart/form-data"}
            })
    }

    return (
        <div>
            <Button type={"primary"}>
                样本上传测试
            </Button>
        </div>
    )
}
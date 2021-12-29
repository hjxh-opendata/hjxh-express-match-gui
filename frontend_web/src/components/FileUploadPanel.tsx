import {Button, message, Spin, Table} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {CheckCircleOutlined, CloseCircleOutlined, InboxOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import axios, {
    URL_CheckFileInfo,
    URL_DB_PUSH_FILE,
    URL_DOWNLOAD_DF,
    URL_DOWNLOAD_SOURCE,
    URL_ReadFile2DF,
    URL_ValidateDF
} from "../axios";
import {ColumnsType} from "antd/lib/table";
import {UploadRequestOption} from "rc-upload/lib/interface";
import {FileState, FileStep, FileStepStatus, FileUpload} from "../ds";
import {FileUploadConfirm} from "./FileUploadConfirm";
import fileDownload from 'js-file-download'
import {getDFName} from "../utils";


// reference: https://stackoverflow.com/a/58812812/9422455, 注意加问号表示缺省
type FileStepChange = { [key in FileStep]?: FileStepStatus }

const renderStatus = (v: FileStepStatus) => {
    if (v === undefined) return ""
    switch (v) {
        case FileStepStatus.Success:
            return <CheckCircleOutlined/>
        case FileStepStatus.Error:
            return <CloseCircleOutlined/>
        case FileStepStatus.Waiting:
            return <Spin/>
        default:
            throw new Error("impossible")
    }
}


export const FileUploadPanel = () => {

    const [fileStates, setFileStats] = useState<FileState[]>([])
    const [fileToConfirm, setFileToConfirm] = useState<string | undefined>(undefined)

    const fileStatesColumns: ColumnsType<Record<any, any>> = [
        {
            title: "文件名",
            dataIndex: "filename"
        }, {
            title: "上传",
            dataIndex: FileStep.fileImported,
            render: (v) => renderStatus(v)

        }, {
            title: '读取',
            dataIndex: FileStep.fileRead,
            render: (v) => renderStatus(v)

        }, {
            title: "清洗",
            dataIndex: FileStep.fileValidated,
            render: (v) => renderStatus(v)

        }, {
            title: "入库",
            dataIndex: FileStep.fileUploaded,
            render: (v) => renderStatus(v)
        },
        {
            title: "操作",
            render: (v, row) => (
                <div className={"inline-flex gap-2"}>

                    <Button
                        disabled={row[FileStep.fileImported] !== FileStepStatus.Success}
                        onClick={() => {
                            axios.get(URL_DOWNLOAD_SOURCE, {
                                params: {file_name: row.filename},
                                responseType: "blob"
                            })
                                .then(s => {
                                    fileDownload(s.data, row.filename)
                                })
                                .catch(e => {
                                    message.error("下载失败")
                                })
                        }}>下载源文件</Button>
                    <Button
                        disabled={row[FileStep.fileValidated] !== FileStepStatus.Success}
                        onClick={() => {
                            axios.get(URL_DOWNLOAD_DF, {params: {file_name: row.filename}, responseType: "blob"})
                                .then(s => {
                                    fileDownload(s.data, getDFName(row.filename))
                                })
                                .catch(e => {
                                    message.error("下载失败")
                                })
                        }}>下载数据表</Button>
                    <Button
                        disabled={!(row[FileStep.fileValidated] === FileStepStatus.Success && row[FileStep.fileUploaded] === undefined)}
                        danger
                        onClick={() => {
                            console.log({filename: row.filename, row, fileToConfirm})
                            setFileToConfirm(row.filename)
                        }}>确认入库</Button>
                </div>
            )
        }
    ]

    const updateAnyFileStep = (filename: string, change: FileStepChange) => {
        // 【重要】防止react刷新拿到旧的props，要把所有逻辑写在函数里，初始变量就是states本身
        setFileStats(fileStates => {
            const index = fileStates.findIndex(fileState => fileState.filename === filename)
            // console.log({filename, index, change, fileStates})
            // console.log(fileStates)
            return index < 0 ? [...fileStates, {filename, ...change, key: filename}]
                : [...fileStates.slice(0, index), {...fileStates[index], ...change}, ...fileStates.slice(index + 1)]
        })
    }

    const confirmFile = async (filename: string) => {
        updateAnyFileStep(filename, {[FileStep.fileUploaded]: FileStepStatus.Waiting})
        await axios.get(URL_DB_PUSH_FILE, {params: {file_name: filename}})
        message.success("入库完成")
        updateAnyFileStep(filename, {[FileStep.fileUploaded]: FileStepStatus.Success})
    }

    const rejectFile = async (filename: string) => {
        message.info("已标记有误")
        updateAnyFileStep(filename, {[FileStep.fileUploaded]: FileStepStatus.Error})
    }

    const customRequest = async (options: UploadRequestOption<any>) => {
        console.log(options)

        const filename = (options.file as File).name
        let curStep = FileStep.fileImported
        const updateFileStep = (change: FileStepChange) => updateAnyFileStep(filename, change)
        try {
            updateFileStep({[FileStep.fileImported]: FileStepStatus.Waiting})
            const fmData = new FormData()
            fmData.append("file", options.file)
            console.log("uploading file")
            let s = await axios.post(
                URL_CheckFileInfo, fmData, {
                    // 前端不用检查后端文件是否存在，直接通过`force_write`字段控制
                    params: {force_write: true},
                    // 这个header很关键，不然服务端总会错
                    // reference:  [How to use Fastapi to handle multiple files upload using axios - Johnnn](https://johnnn.tech/q/how-to-use-fastapi-to-handle-multiple-files-upload-using-axios/)
                    // https://stackoverflow.com/q/23548232/9422455
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        // "Content-Type": "multipart/form-data",
                        // "Content-Disposition": "application/xml",
                    }
                })
            curStep += 1
            updateFileStep({
                [FileStep.fileImported]: FileStepStatus.Success,
                [FileStep.fileRead]: FileStepStatus.Waiting,
                ...s.data.data
            })
            s = await axios.get(URL_ReadFile2DF, {params: {file_name: filename}})
            curStep += 1
            updateFileStep({
                [FileStep.fileRead]: FileStepStatus.Success,
                [FileStep.fileValidated]: FileStepStatus.Waiting,
                ...s.data.data
            })
            s = await axios.get(URL_ValidateDF, {params: {file_name: filename}})
            curStep += 1
            updateFileStep({[FileStep.fileValidated]: FileStepStatus.Success, ...s.data.data})

        } catch (e) {
            updateFileStep({[curStep]: FileStepStatus.Error})
            console.error(e)
        }
    }

    useEffect(() => {
        console.log(fileStates)

    }, [fileStates])

    return (
        <div>
            <Dragger multiple={true} showUploadList={false} customRequest={customRequest}>
                <div className={"flex items-center justify-center"}>

                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">
                        点击 / 拖拽，上传ERP、TRD表
                    </p>
                </div>

                <ol type={"A"}
                    style={{listStyle: "inside", listStyleType: "upper-roman", margin: 10}}>
                    <li>ERP表：从ERP系统中导出的<b>.csv</b>格式文件，并且以<b>erp_</b>为前缀；</li>
                    <li>ERP表中必须包含的列字段为：<b>物流单号、收货地区、实际重量、发货时间、物流公司</b></li>

                    <li>TRD表：物流公司的<b>.xlsx、.xls</b>格式文件，并且以<b>trd_</b>为前缀；</li>
                    <li>TRD表必须包含带<b>_明细</b>前缀的明细表，且必须新建一列<b>_快递</b>作为价格表中物流公司的抬头</li>
                    <li>TRD表中必须包含的列字段为：<b>_快递、快递单号、省份、重量、发货时间、运费</b></li>

                    <li>所有的表首行必须为各关键字段，尾部汇总行请与数据区域隔开，保证数据区域是一个完整的矩形</li>
                </ol>

            </Dragger>


            {fileStates.length > 0 &&
                <Table dataSource={fileStates} columns={fileStatesColumns} pagination={false}/>}

            {
                fileToConfirm !== undefined && <FileUploadConfirm
                    f={(fileStates[fileStates.findIndex(f => f.filename === fileToConfirm)]) as FileUpload}
                    setFn={setFileToConfirm}
                    confirm={confirmFile}
                    reject={rejectFile}
                />
            }
        </div>
    )
}
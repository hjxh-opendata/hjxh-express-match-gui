import {FileStep, FileStepStatus} from "../ds";
import {Col, Collapse, Divider, Input, message, Modal, Row, Spin, Timeline} from "antd";
import {WarningOutlined} from "@ant-design/icons";
import React, {Dispatch, useRef, useState} from "react";
import axios, {URL_CONFIRM_FILE} from "../axios";

export interface FileUpload1 {
    [FileStep.fileImported]: FileStepStatus
    filename: string
    key: string
}

export interface FileUpload2 {
    [FileStep.fileRead]: FileStepStatus
    file_size: number
    file_stand: "trd" | "erp"
    file_type: ".xlsx" | ".xls" | ".csv"
    read_time: number
}

export interface FileUpload3 {
    [FileStep.fileValidated]: FileStepStatus
    columns_map: Record<string, string>
    df_shape: [number, number]
    dfs_count: number
    rows: number[]
    // rows_1_initial: number
    // rows_2_dropna_id: number
    // rows_3_drop_duplicated_id: number
    // rows_4_dropna: number
    // rows_5_drop_weight_invalid: number
    // rows_6_drop_date_invalid: number
    // rows_7_drop_province_invalid: number
    // rows_8_drop_fee_invalid: number
}

export type FileUpload = FileUpload1 & FileUpload2 & FileUpload3


enum COLOR {
    OK = "blue",
    ERROR = "red"
}

export enum Operation {
    confirm = "confirm",
    reject = "reject",
    close = "close"
}

export const ROWS_DESC = [
    "原表读取行数",
    "ID列去空后行数",
    "ID列去重后行数",
    "整表去空后行数",
    "重量列合格行数",
    "日期列合格行数",
    "地区列合格行数",
    "费用列合格行数"
]

export interface FileUploadConfirmProps {
    f: FileUpload
    confirm: (s: string) => void
    reject: (s: string) => void
    setFn: Dispatch<string | undefined>
}

export const FileUploadConfirm = ({f, confirm,reject, setFn}: FileUploadConfirmProps) => {
    const refNotes = useRef<string[]>(new Array(8).fill(''))
    const [isConfirming, setConfirming] = useState(false)

    if (f[FileStep.fileValidated] !== FileStepStatus.Success) return <div>error</div>

    const InputRow = ({i, p}: { i: number, p: string }) => {
        const error = i > 0 && f.rows[i] < f.rows[i - 1]
        const color = error ? COLOR.ERROR : COLOR.OK
        const show = i == 0 || error
        return <Timeline.Item color={color}>
            <Row>
                <Col span={8}>{ROWS_DESC[i]}: </Col>
                <Col span={4}>{f.rows[i]}</Col>
                <Col span={12}>
                    {show &&
                        <Input.TextArea size={"small"} placeholder={p}
                                        defaultValue={refNotes.current[i]}
                                        onBlur={e => refNotes.current[i] = e.target.value}
                                        autoSize={true}/>}
                </Col>
            </Row>
        </Timeline.Item>
    }
    return (

        <Modal visible={f !== undefined}
               cancelText={"拒绝"}
               cancelButtonProps={{danger: true, type: 'primary'}}
               okText={"入库"}
               onCancel={() => {
                   setFn(undefined)
                   reject(f.filename)
                   axios.post(URL_CONFIRM_FILE, {
                       update_time: new Date(),
                       file_name: f.filename,
                       rows: f.rows,
                       notes: refNotes.current,
                       operation: Operation.reject
                   })
               }}
               onOk={async () => {
                   console.log(refNotes.current)
                   setConfirming(true)
                   axios.post(URL_CONFIRM_FILE, {
                       update_time: new Date(),
                       file_name: f.filename,
                       rows: f.rows,
                       notes: refNotes.current,
                       operation: Operation.confirm
                   }).catch(e => {
                       console.log(e)
                       message.error(e.data)
                   }).then(s => {
                       message.success("确认成功，正在入库")
                       confirm(f.filename)
                       setFn(undefined)
                   }).finally(() => {
                       setConfirming(false)
                   })
               }}>
            <Spin spinning={isConfirming}>
                <h2 className={"mb-8 text-center"}>文件名：{f.filename}</h2>
                <Timeline>
                    <InputRow i={0} p={"请确认总表行数无误"}/>
                    {f.rows.slice(1).map((r, i) =>
                        <InputRow i={i + 1} p={'请输入检查后错误的原因'} key={i + 1}/>)}
                </Timeline>

                <div>
                    <Collapse>
                        <Collapse.Panel header={"数据解释"} key={1}>
                            <ol className={"text-sm"} style={{listStyle: "inside"}}>
                                <li>若[原表行数]大于[去空行数]，说明可能有多余的汇总行、目标列中存在空单元格、物流单号有重复等</li>
                                <li>若[去空行数]大于[重量行数]，说明重量列有为0等非正数的数据</li>
                                <li>若[重量行数]大于[日期行数]，说明日期列有无法识别的日期数据</li>
                                <li>若[日期行数]大于[地区行数]，说明地区列有无法检测出34个省市自治区信息的数据</li>
                                <li>若[地区行数]大于[费用行数]，说明费用列有为0等非正数的数据</li>
                            </ol>
                        </Collapse.Panel>

                    </Collapse>
                    <Divider/>

                    <div className={"inline-flex"}>
                        <WarningOutlined color={"red"} className={" mr-2 mt-1"}/>
                        <p className={"font-medium"}>
                            请确认以上数据均无误，或输入错误行的解释 <br/>
                            否则建议修改完原Excel表重新上传，以免后续比对出现问题
                        </p>
                    </div>
                </div>
            </Spin>
        </Modal>

    )
}
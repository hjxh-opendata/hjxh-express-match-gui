import {COLOR, FileStep, FileStepStatus, FileUpload, Operation} from "../ds";
import {Col, Collapse, Divider, Input, message, Modal, Row, Timeline} from "antd";
import {WarningOutlined} from "@ant-design/icons";
import React, {Dispatch, useRef} from "react";
import axios, {URL_CONFIRM_FILE} from "../axios";


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

export const FileUploadConfirm = ({f, confirm, reject, setFn}: FileUploadConfirmProps) => {
    const refNotes = useRef<string[]>(new Array(8).fill(''))

    if (f[FileStep.fileValidated] !== FileStepStatus.Success) return <div>error</div>

    const InputRow = ({i, p}: { i: number, p: string }) => {
        const error = i > 0 && f.rows[i] < f.rows[i - 1]
        const color = error ? COLOR.ERROR : COLOR.OK
        const show = i === 0 || error
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
                   console.log(refNotes.current)
                   setFn(undefined)
                   reject(f.filename)
                   axios.post(URL_CONFIRM_FILE, {
                       update_time: new Date(),
                       file_name: f.filename,
                       rows: f.rows,
                       notes: refNotes.current,
                       operation: Operation.rejected
                   })
               }}
               onOk={async () => {
                   console.log(refNotes.current)
                   setFn(undefined)
                   axios.post(URL_CONFIRM_FILE, {
                       update_time: new Date(),
                       file_name: f.filename,
                       rows: f.rows,
                       notes: refNotes.current,
                       operation: Operation.confirmed
                   }).catch(e => {
                       console.log(e)
                       message.error(e.data)
                   }).then(s => {
                       message.success("确认成功，正在入库")
                       confirm(f.filename)
                   })
               }}>
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
        </Modal>

    )
}
import {Collapse, Form, message, notification, Select, Switch, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useQueryType} from "./useQueryType";
import {QueryType} from "../ds";
import {getValidatedData} from "../utils";

const {Option} = Select


const validateReturn = (value: boolean) => {
    return value ?
        <CheckCircleOutlined style={{color: "green"}}/> :
        <CloseCircleOutlined style={{color: "darkred"}}/>
}


/**
 * 数据列字段定义
 */
const databaseColumns: ColumnsType<Record<any, any>> = [
    {dataIndex: "_id", title: "ID",},
    {
        title: "物流公司",
        children: [{dataIndex: "logistics_erp", title: "erp"}, {dataIndex: 'logistics_trd', title: "trd"},]
    },
    {title: "发货时间", children: [{dataIndex: "time_erp", title: "erp"}, {dataIndex: "time_trd", title: "trd"},]},
    {title: "省份", children: [{dataIndex: "area_erp", title: 'erp'}, {dataIndex: "area_trd", title: "trd"},]},
    {title: "重量", children: [{dataIndex: "weight_erp", title: "erp"}, {dataIndex: "weight_trd", title: "trd"},]},

    {
        title: "校验",
        children: [
            {
                title: "地区",
                render: record => validateReturn(record.validate_area)
            },
            {
                title: "重量",
                render: record => validateReturn(record.validate_weight)
            },
            {
                title: "ALL",
                render: record => validateReturn(record.validate_pass)
            }
        ]
    },
    {
        title: "快递费用",
        children: [

            {
                dataIndex: "fee_trd",
                title: "trd"
            },
            {
                dataIndex: "fee_eval",
                title: "核算"
            },
        ]
    },
]


export const DBValidationPanel = () => {

    // todo: queryDict
    const [queryDict, setQueryDict] = useState({})
    const [_data, setQueryType] = useQueryType()
    const [weightSmall, setWeightSmall] = useState(1)
    const [superFilterEnabled, setSuperFilterEnabled] = useState(false)

    const [data, nValidated] = getValidatedData(_data, weightSmall)

    return (
        <Collapse>
            <Collapse.Panel key={1} header={"数据库校对"}>

                <Form className={"flex justify-between px-4"}>
                    <Form.Item label={"初级筛选失衡条件"}>
                        <Select defaultValue={QueryType.ErpMissing} onChange={setQueryType}>
                            <Option value={QueryType.ErpMissing}>TRD中有，但是ERP中没有</Option>
                            <Option value={QueryType.TrdMissing}>ERP中有，但是TRD中没有</Option>
                            <Option value={QueryType.AreaMismatch}>ERP与TRD间地区失配</Option>
                            {/*<Option value={QueryType.DateMismatch}>ERP与TRD间日期失配</Option>*/}
                            {/*<Option value={QueryType.WeightMismatch}>ERP与TRD间重量失配</Option>*/}
                        </Select>
                    </Form.Item>

                    <Form.Item label={"高级"}>
                        <Switch checked={superFilterEnabled} onChange={()=>{
                            message.warning( "下个版本敬请期待")
                            // setSuperFilterEnabled(!superFilterEnabled)
                        }}/>
                    </Form.Item>
                </Form>


                <Table
                    pagination={false}
                    columns={databaseColumns}
                    dataSource={data}
                    expandable={{
                        expandedRowRender: record => {
                            return <p
                                style={{margin: 0}}>{`erp来源: ${record.file_name_erp}, trd来源：${record.file_name_trd}`}</p>
                        }
                    }}
                />
            </Collapse.Panel>
        </Collapse>
    )
}
import {Collapse, message, Spin} from "antd";
import {Bar, BarChart, Brush, Pie, PieChart, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import axios, {URL_DB_STAT_AREA, URL_DB_STAT_DATE, URL_DB_STAT_LOGISTICS} from "../axios";


const useDb = (url: string, limit: number | undefined = undefined): [any[], boolean] => {
    const [data, setData] = useState([])
    const [isFetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true)
        axios.get(url)
            .then(s => {
                console.log(s.data.data)
                setData(s.data.data.slice(0, limit))
            }).catch(e => {
            message.error("获取数据失败")
        }).finally(() => {
            setFetching(false)
        })
    }, [])
    return [data, isFetching]
}


export const DBVisualStatPanel = () => {
    const [dataDate, isFetchingDate] = useDb(URL_DB_STAT_DATE)
    const [dataArea, isFetchingArea] = useDb(URL_DB_STAT_AREA,)
    const [dataLogistics, isFetchingLogistics] = useDb(URL_DB_STAT_LOGISTICS,)

    return (
        <Collapse>
            <Collapse.Panel key={1} header={"数据库统计"}>
                <div className={"flex flex-wrap justify-around"}>

                    <div className={"hidden md:flex md:w-1/2 lg:w-1/3  justify-center"}>
                        <Spin spinning={isFetchingLogistics}>
                            <h2>按快递公司统计</h2>
                            {/* 如果不加居中的话，子图会靠左 */}
                            <PieChart width={400} height={250} className={"flex justify-center"}>
                                <Pie data={dataLogistics} nameKey={"_id"} dataKey="cnt" fill="#8884d8"
                                     innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270}/>
                                <Tooltip/>
                            </PieChart>
                        </Spin>
                    </div>


                    <div className={"w-full md:w-1/2 lg:w-1/3 flex justify-center text-center"}>
                        <Spin spinning={isFetchingDate}>
                            <h2>按日期统计</h2>
                            {dataDate.length > 0 &&
                                <BarChart width={400} height={250} data={dataDate} className={"flex justify-center"}>
                                    <XAxis dataKey={"_id"} tickFormatter={(s: string) => s && s.slice(5)}/>
                                    <YAxis tickFormatter={(s: number) => s ? (~~(s / 10000) + "w") : "0"}/>
                                    <Bar dataKey="cnt" fill="#8884d8"/>
                                    <Tooltip/>
                                    <Brush dataKey="_id" height={30} stroke="#8884d8"/>
                                </BarChart>
                            }
                        </Spin>
                    </div>


                    <div className={"hidden lg:flex lg:w-1/3  justify-center"}>
                        <Spin spinning={isFetchingArea}>
                            <h2>按省份统计</h2>
                            <PieChart width={400} height={250} className={"flex justify-center"}>
                                <Pie data={dataArea} nameKey={"_id"} dataKey="cnt" fill="#8884d8"
                                     innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}/>
                                <Tooltip/>
                            </PieChart>
                        </Spin>
                    </div>
                </div>

            </Collapse.Panel>
        </Collapse>
    )
}
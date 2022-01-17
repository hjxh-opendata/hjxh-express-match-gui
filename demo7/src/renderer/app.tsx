import * as React from "react";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { CollName, Msg, QueryReq } from "../main/const";
import { Breadcrumb, Button, Layout, Menu, Tabs } from "antd";

const { Sider, Footer, Header, Content } = Layout
const { SubMenu } = Menu
const { TabPane } = Tabs

import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import ErpUpload from "./components/ErpUpload";


export const App = () => {
    ipcRenderer.on(Msg.db_query_res, (item) => {
        console.log(`received item:  ${item}`)
    })

    useEffect(() => {
        console.log("started sending request to main process")
        const queryReq: QueryReq = {
            collName: CollName.items,
            query: {
                limit: 10,
                skip: 0,
                query: {}
            }
        }
        ipcRenderer.send(Msg.db_query_req, queryReq)
        console.log("sent db query request")
    }, [])

    const [siderCollapsed, setSiderCollapsed] = useState(false)
    const [tabSelected, setTabSelected] = useState("TabUploadERP")
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/*<Sider collapsible collapsed={siderCollapsed} onCollapse={setSiderCollapsed}>*/}
            {/*    <div className="logo"/>*/}
            {/*    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">*/}
            {/*        <Menu.Item key="1" icon={<PieChartOutlined/>}>*/}
            {/*            Option 1*/}
            {/*        </Menu.Item>*/}
            {/*        <Menu.Item key="2" icon={<DesktopOutlined/>}>*/}
            {/*            Option 2*/}
            {/*        </Menu.Item>*/}
            {/*        <SubMenu key="sub1" icon={<UserOutlined/>} title="User">*/}
            {/*            <Menu.Item key="3">Tom</Menu.Item>*/}
            {/*            <Menu.Item key="4">Bill</Menu.Item>*/}
            {/*            <Menu.Item key="5">Alex</Menu.Item>*/}
            {/*        </SubMenu>*/}
            {/*        <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">*/}
            {/*            <Menu.Item key="6">Team 1</Menu.Item>*/}
            {/*            <Menu.Item key="8">Team 2</Menu.Item>*/}
            {/*        </SubMenu>*/}
            {/*        <Menu.Item key="9" icon={<FileOutlined/>}>*/}
            {/*            Files*/}
            {/*        </Menu.Item>*/}
            {/*    </Menu>*/}
            {/*</Sider>*/}

            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    <Tabs defaultActiveKey={tabSelected} className={"px-8"}>
                        <TabPane tab={"上传TRD表"} key={"TabUploadTRD"}>
                        </TabPane>
                        <TabPane tab={"上传ERP表"} key={"TabUploadERP"}>
                            <ErpUpload />
                        </TabPane>
                        <TabPane tab={"历史记录"} key={"TabHistory"}>
                        </TabPane>
                    </Tabs>
                </Header>

                <Content style={{ margin: '0 16px' }}>
                    {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
                    {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}


                </Content>

                <Footer style={{ textAlign: 'center' }}>For HJXH Finance, Created by Mark via Electron, Antd, TailwindCSS,
                    TypeScript ©2021 </Footer>
            </Layout>
        </Layout>
    );
};

export default App






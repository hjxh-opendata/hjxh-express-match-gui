import React, {useEffect, useState} from 'react';
import './App.css';
import {Layout} from "antd";
import {DBValidationPanel} from "../components/DBValidationPanel";
import {FileUploadPanel} from "../components/FileUploadPanel";
import {DBVisualStatPanel} from "../components/DBVisualStatPanel";
import axios from "../axios";

function App() {
    const [online, setOnline] = useState(false)

    const handlePingPongError = () => {
        console.log('ping pong test failed')
        setOnline(false)
        setTimeout(pingPong, 10000)
    }

    const pingPong = async () => {
        try {
            const res = await axios.get('/ping')
            console.log(res.data)
            if (res.data !== "pong") {
                handlePingPongError()
                return;
            }
            console.log('ping-pong~')
            setOnline(true)
            setTimeout(pingPong, 60000)
        } catch (e) {
            handlePingPongError()
        }
    }

    useEffect(() => {
        pingPong()
    }, [])

    return (
        <div className="App relative mx-auto" style={{maxWidth: 1280}}>

            <Layout>

                {/* 不能用text-xl，因为它会同时修改字体大小和行高，导致不能垂直居中 */}
                <Layout.Header className={"relative bg-yellow-500  sticky z-50 top-0 text-white"}>
                    <div className={"text-white font-semibold"} style={{fontSize: 24}}>
                        皇家小虎快递核比
                    </div>
                    <div className={"absolute top-1 right-4"}>
                        服务器状态：{
                        online ?
                            <span className={"font-medium text-green-700"}>在线</span> :
                            <span className={'font-medium text-red-900'}>离线</span>
                    }
                    </div>

                </Layout.Header>

                <Layout>

                    <Layout.Content>

                        <DBVisualStatPanel/>

                        <DBValidationPanel/>

                        <FileUploadPanel/>

                    </Layout.Content>

                </Layout>

            </Layout>


        </div>
    );
}

export default App;

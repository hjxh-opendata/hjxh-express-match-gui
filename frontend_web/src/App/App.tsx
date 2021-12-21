import React from 'react';
import './App.css';
import {Layout} from "antd";
import { DBValidationPanel} from "../components/DBValidationPanel";
import {FileUploadPanel} from "../components/FileUploadPanel";
import {DBVisualStatPanel} from "../components/DBVisualStatPanel";

function App() {
    return (
        <div className="App relative mx-auto" style={{maxWidth: 1280}}>

            <Layout>

                {/* 不能用text-xl，因为它会同时修改字体大小和行高，导致不能垂直居中 */}
                <Layout.Header className={"bg-yellow-500 text-white sticky z-50 top-0 font-semibold"} style={{fontSize: 24}}>
                    皇家小虎快递核比
                </Layout.Header>

                <Layout>

                    <Layout.Content>

                        <DBVisualStatPanel/>

                        <DBValidationPanel />

                        <FileUploadPanel/>

                    </Layout.Content>

                </Layout>

            </Layout>


        </div>
    );
}

export default App;

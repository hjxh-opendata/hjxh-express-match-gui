import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { addScore, desScore } from "../redux/score/actions";
import { asyncAddScore, asyncDesScore } from "../redux/score-async/actions";
import { ScoreAction } from "../redux/score/actionTypes";
import { ScoreAsyncAction } from "../redux/score-async/actionTypes";
import {Layout, message, Table, UploadProps} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import { useState } from "react";
import {DraggerProps} from "antd/lib/upload";
import {UploadFile} from "antd/es/upload/interface";

export interface AppProps {
  score: number;
  addScore: () => ScoreAction;
  desScore: () => ScoreAction;
  asyncAddScore: () => ScoreAsyncAction;
  asyncDesScore: () => ScoreAsyncAction;
}

const columns = [
  {
    title: "文件名",
    dataIndex: "fileName",
  },
  {
    title: "文件大小",
    dataIndex: "fileSize",
    render: (t: string) => (Number(t) / 1024 / 1024).toFixed(2) + "Mb",
  },
];

export const App = (props: AppProps) => {
  const [files, setFiles] = useState([]);
  const [x, setX] = useState(0)
  const getTableData = () => {
    // console.log({fileList})
    return []
    return files.map((x) => ({
      fileName: x.response.pack.file_name,
      fileSize: x.response.pack.file_size,
      key: x.response.pack.file_name,
    }))
  }


  const dragProps: React.FC<DraggerProps> = {
    // @ts-ignore
    name: "file",
    multiple: true,
    fileList: files,

    action: "http://localhost:8000/upload/file?test=true",

    onRemove: (file: UploadFile) => {
      setFiles(files.filter(f => f.name !== file.name))
    },

    onChange({file, fileList, event}: UploadChangeParam) {
      // if(!fileList.some((x: UploadFile) => x.fileName === info.file.fileName))
      switch(file.status) {
        case "done":
        // setFiles(fileList)
        message.success(`${file.name} file uploaded successfully.`);
          break
        case "error":
        message.error(`${file.name} file upload failed.`);
          break
        case "uploading":
          console.log(`uploading percent: ${file.percent}`)
      }
    },
    beforeUpload: (file: RcFile, fileList: RcFile[]) => {
      console.log({beforeUpload: {file, fileList}})
      if(!files.some(x => x.name === file.name)) {
        console.log("updating files")
        // setX(x+1)
        setFiles([...files, file])
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      <Layout>
        <Layout.Header></Layout.Header>
        <Layout.Content>
          <Dragger{...dragProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>

          <Table columns={columns} dataSource={getTableData()}></Table>
        </Layout.Content>
        <Layout.Footer></Layout.Footer>
      </Layout>

      {/*<h1>your score is: {props.score}</h1>*/}
      {/*<div>*/}
      {/*  <button onClick={props.addScore}>ADD</button>*/}
      {/*  <button onClick={props.desScore}>DES</button>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <button onClick={props.asyncAddScore}>ADD_ASYNC</button>*/}
      {/*  <button onClick={props.asyncDesScore}>DES_ASYNC</button>*/}
      {/*</div>*/}
    </div>
  );
};

const mapState = (state: AppState) => ({
  score: state.score.value,
});

const mapDispatch = {
  addScore,
  desScore,
  asyncAddScore,
  asyncDesScore,
};

export default connect(mapState, mapDispatch)(App);

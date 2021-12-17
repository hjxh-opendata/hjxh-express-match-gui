import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { addScore, desScore } from "../redux/score/actions";
import { asyncAddScore, asyncDesScore } from "../redux/score-async/actions";
import { ScoreAction } from "../redux/score/actionTypes";
import { ScoreAsyncAction } from "../redux/score-async/actionTypes";
import { Layout, message, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";

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
    dataIndex: "file_name",
  },
  {
    title: "文件大小",
    dataIndex: "file_size",
    render: (t: string) => (Number(t) / 1024 / 1024).toFixed(2) + "Mb",
  },
];

export const App = (props: AppProps) => {
  const [files, setFiles] = useState([]);

  const appProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:8000/upload/file",
    onChange(info: UploadChangeParam) {
      console.log({ info });
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);

        setFiles(info.fileList.map((x) => ({ ...x, ...{ key: x.fileName } })));
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
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
          <Dragger multiple={true} {...appProps}>
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

          <Table columns={columns} dataSource={files}></Table>
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

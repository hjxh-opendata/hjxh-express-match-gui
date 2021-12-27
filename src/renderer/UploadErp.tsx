import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

import { ApiKey } from '../main/const';

// ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
export const UploadErp = () => {
  const [msgs, setMsgs] = useState([]);

  const requestReadFile = () => {
    console.log('requesting read file');
    window.electron.ipcRenderer.once(ApiKey.requestReadFile, (v) => {
      console.log('received files return: ', v);
    });
    window.electron.ipcRenderer.requestReadFile();
  };

  return (
    <div className={'min-w-1/2 max-w-full pt-20'}>
      <div
        id={'upload-view'}
        className={'flex flex-wrap'}
        style={{ minHeight: 200 }}
      >
        <div
          id={'upload-area'}
          className={'flex justify-center items-center flex-col'}
          style={{ width: 300, border: '2px dashed' }}
          onClick={requestReadFile}
        >
          <CloudUploadIcon fontSize={'large'} color={'primary'} />
          <div className={'text-center m-8 text-base'}>单击或拖拽文件上传</div>
        </div>

        <div
          id={'upload-history'}
          className={'flex flex-col items-center'}
          style={{ width: 300 }}
        >
          <div className={'text-center m-8 text-base'}>上传历史</div>
          <div>暂无</div>
        </div>
      </div>

      <div
        id={'upload-cmd'}
        className={'text-white text-sm mt-16'}
        style={{
          minHeight: 300,
          maxHeight: 600,
          overflow: 'auto',
          background: '#f37CaA',
        }}
      >
        <p className={'text-base text-white font-bold p-2'}> CONSOLE</p>
        {msgs.map((msg, i) => (
          <p key={i}> {msg}</p>
        ))}
        <div className={' h-0.5 bg-white w-full'} />
      </div>
    </div>
  );
};

export default UploadErp;

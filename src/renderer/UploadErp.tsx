import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

import { Channels, getTime } from '../universal';

import { ScrollToBottom } from './components/ScrollToBottom';

export enum MsgLevel {
  debug,
  info,
  warn,
  error,
}
export interface MsgItem {
  msg: string;
  time: string;
  level: MsgLevel;
}

export const UploadErp = () => {
  const [msgs, setMsgs] = useState<MsgItem[]>([]);
  const pushMsg = (msg: string) => {
    setMsgs([...msgs, { msg, time: getTime(), level: MsgLevel.debug }]);
  };

  const requestReadFile = () => {
    console.log('requesting read file');
    window.electron.once(Channels.requestSelectFile, (v: string[]) => {
      console.log('received files return: ', v);
      if (v.length === 0) return;
      if (v.length > 1) throw new Error('multiple file import not yet support'); // todo: multiple file import
      pushMsg(`selected file: ${v[0]}`);
    });
    window.electron.request(Channels.requestSelectFile);
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'min-w-1/2 max-w-full pt-20'}>
      <div
        id={'upload-view'}
        className={'flex flex-wrap'}
        style={{ minHeight: 200 }}
      >
        {/* ref:
        - [eslint-plugin-jsx-a11y/no-static-element-interactions.md at master · jsx-eslint/eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md)
        - [eslint-plugin-jsx-a11y/interactive-supports-focus.md at master · jsx-eslint/eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md)
        - [eslint-plugin-jsx-a11y/click-events-have-key-events.md at master · jsx-eslint/eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md)
        */}
        <div
          role={'button'}
          tabIndex={-1}
          aria-hidden
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
        className={' mt-16 relative bg-pink-200'}
        style={{ width: 600 }}
      >
        <div className={'absolute top-0 left-0 z-100 w-full bg-pink-500'}>
          <p className={'text-base text-white font-bold p-2'}> CONSOLE</p>
          <div className={'h-0.5 bg-white'} />
        </div>

        <div
          style={{ minHeight: 200, maxHeight: 400 }}
          className={'overflow-auto p-2 pt-12 text-black text-sm'}
        >
          {msgs.map((msg) => (
            <p key={msg.time} style={{ textIndent: '2em' }}>
              <span className={`mr-2 text-pink-${msg.level * 200 + 300}`}>
                {msg.time}
              </span>
              <span> {msg.msg}</span>
            </p>
          ))}

          <ScrollToBottom id={msgs.length} />
        </div>
      </div>
    </div>
  );
};

export default UploadErp;

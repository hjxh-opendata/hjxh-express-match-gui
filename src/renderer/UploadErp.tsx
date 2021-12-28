import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, useState } from 'react';

import { Channels, MsgFromMain, MsgLevel, OVER } from '../universal';

import ScrollToBottom from './components/ScrollToBottom';

export interface MsgConsole {
  text: string;
  time: Date;
  level: MsgLevel;
}

export const UploadErp = () => {
  const [msgs, setMsgs] = useState<MsgConsole[]>([]);
  const refScroll = useRef(null as unknown as HTMLDivElement);
  /**
   * 这里很有意思的点：
   * 1. 若写成 `setMsgs([...msgs, msg])`，则`requestReadFile`函数中只会在request函数整个结束后才会更新一次消息，并且漏掉了"selecting file"
   * 2. 若写成 `setMsgs(() => [...msgs, msg])`，则`requestReadFile`函数中`selecting file`会显示，但是等`once`结束时会覆盖它
   * 3. 只有写成 `setMsgs(msgs => [...msgs, msg])`，才会让`selecting file`和`once`都能更新并显示信息
   *
   * 分析：
   * 这背后应该是异步更新的原因~ `once`是一个异步函数，联想`redux`里的`dispatch`不难想到，它们也是用函数进行更新的，也就是：
   * f => g => h
   * @param msg
   */
  const pushMsg = (msg: MsgConsole) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setMsgs((msgs) => [...msgs.slice(msgs.length === 100 ? 1 : 0), msg]);

    // @ts-ignore
    refScroll.current?.doScroll();
  };

  const requestReadFile = (fp: string) => {
    console.log(`reading file: ${fp}`);
    pushMsg({
      text: `reading file`,
      level: MsgLevel.debug,
      time: new Date(),
    });
    window.electron.on(Channels.requestReadFile, (msg: MsgFromMain) => {
      console.log(msg);
      // todo: suppress some
      pushMsg({
        text: (msg.content as string[]).join('\t'),
        level: MsgLevel.debug,
        time: msg.sendTime,
      });
      if (msg.content === OVER) {
        window.electron.removeChannel(Channels.requestReadFile);
        pushMsg({
          text: `reading finished`,
          level: MsgLevel.debug,
          time: new Date(),
        });
      }
    });
    window.electron.request(Channels.requestReadFile, fp);
  };

  const requestSelectFile = () => {
    console.log('selecting file');
    pushMsg({
      text: 'selecting file',
      time: new Date(),
      level: MsgLevel.debug,
    });
    window.electron.once(Channels.requestSelectFile, (m: MsgFromMain) => {
      console.log('received files return: ', m);
      const filePaths = m.content as string[];

      if (filePaths.length === 0) {
        pushMsg({
          level: MsgLevel.debug,
          time: m.sendTime,
          text: 'cancelled',
        });
        return;
      }

      // impossible
      if (filePaths.length > 1) {
        pushMsg({
          level: MsgLevel.error,
          time: m.sendTime,
          text: 'should filePaths.length === 1',
        });
        return;
      }

      pushMsg({
        text: `selected file: ${filePaths[0]}`,
        level: m.level,
        time: m.sendTime,
      });

      // request reading file
      requestReadFile(filePaths[0]);
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
          onClick={requestSelectFile}
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
          {msgs.map((msg, i) => (
            <p key={i} style={{ textIndent: '2em' }}>
              <span className={`mr-2 text-pink-${msg.level * 200 + 300}`}>
                {msg.time.toLocaleString()}
              </span>
              <span> {msg.text}</span>
            </p>
          ))}

          <ScrollToBottom ref={refScroll} />
        </div>
      </div>
    </div>
  );
};

export default UploadErp;

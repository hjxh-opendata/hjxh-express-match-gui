import React from 'react';

import { LogLevel } from '../main/base/interface/log';
import { IRes } from '../main/base/interface/response';
import { getFileNameFromPath } from '../main/base/interface/utils';
import { IReqParseFile, RequestParseFile } from '../main/modules/parseFile/interface/channels';
import {
  IContentParsingFile,
  isContentEnd,
  isContentError,
  isContentSuccess,
} from '../main/modules/parseFile/interface/content';
import { IParsingProgress } from '../main/modules/parseFile/interface/rows';
import { RequestSelectFile } from '../main/modules/selectFile/interface/channels';
import { IContentSelectFile } from '../main/modules/selectFile/interface/response';

import { Console, IConsoleItem, makeItemFromMain, makeItemFromText } from './components/Console';
import { UploadClick } from './components/UploadClick';
import UploadHistory, { IUploadItem } from './components/UploadHistory';

import { IDataErp } from './data/erp';
import { Menus } from './data/menu';
import { renderProgressing } from './utils';

export interface MenuUploadErpDispatches {
  setConsoles: (item: IConsoleItem) => void;
  setSizePct: (v) => void;
  setRowsPct: (v) => void;
  setUploaded: (item: IUploadItem) => void;
}

/**
 * todo: [+++] 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const MenuUploadErp = (
  props: IDataErp & MenuUploadErpDispatches & { isFocused: boolean }
) => {
  console.log('erp props: ', props);

  const pushMsg = (msg: IConsoleItem) => {
    props.setConsoles(msg);
  };

  const resetPct = () => {
    props.setSizePct(0);
    props.setRowsPct(0);
  };

  const updatePct = (progress: IParsingProgress) => {
    props.setSizePct(progress.sizePct);
    props.setRowsPct(progress.rowsPct);
  };

  const requestSelectFile = () =>
    new Promise<string | null>((resolve) => {
      console.log('selecting file');
      window.electron.request(RequestSelectFile);
      window.electron.once(RequestSelectFile, (res: IRes<IContentSelectFile>) => {
        console.log('received files return: ', res);
        const { filePaths } = res.content;
        if (filePaths.length === 0) return pushMsg(makeItemFromText('cancelled'));
        if (filePaths.length > 1)
          return pushMsg(makeItemFromText('should filePaths.length === 1', LogLevel.error));
        // prettier-ignore
        pushMsg(makeItemFromMain(res, (c: IContentSelectFile) => `selected file: ${getFileNameFromPath(c.filePaths[0])}`));

        const fp = filePaths[0];
        // check existed
        if (props.uploaded.some((i) => getFileNameFromPath(fp) === i.fileName))
          // prettier-ignore
          return pushMsg(makeItemFromText(`[UPLOAD DENY]: the file '${getFileNameFromPath(fp)}' has been uploaded!`, LogLevel.warn));
        return resolve(fp);
      });
    });

  const requestParseFile = (req: IReqParseFile) =>
    new Promise<boolean>(() => {
      console.log('reading file...'); // for placeholder
      const fileName = getFileNameFromPath(req.fp);

      window.electron.request(RequestParseFile, req);
      window.electron.on(RequestParseFile, (res: IRes<IContentParsingFile>) => {
        console.log(res);
        const { content } = res;

        if (isContentSuccess(content)) {
          /**
           * success
           */
          updatePct(content.progress);
        } else if (isContentError(content)) {
          /**
           * error
           */
          pushMsg(makeItemFromMain(res));
        } else if (isContentEnd(content)) {
          /**
           * end
           */
          window.electron.removeChannel(RequestParseFile);
          pushMsg(makeItemFromText(renderProgressing(content.progress), LogLevel.info));
          resetPct();
          props.setUploaded({ fileName, updateTime: new Date() });
        } else throw new Error('impossible content type');
      });
    });

  const onClickUpload = async () => {
    const fp = await requestSelectFile();
    if (fp === null) return console.log('no valid file chose');
    return requestParseFile({ fp, isErp: true });
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'min-w-1/2 max-w-full mt-8 overflow-auto'}>
      <UploadClick sizePct={props.sizePct} rowsPct={props.rowsPct} onClick={onClickUpload} />

      <Console items={props.consoleItems} isFocused={props.isFocused} />

      <UploadHistory items={props.uploaded} />
    </div>
  );
};

export default MenuUploadErp;

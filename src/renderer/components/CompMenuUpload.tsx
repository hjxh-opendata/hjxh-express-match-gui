import React from 'react';

import { LogLevel } from '../../main/base/interface/log';
import { IRes } from '../../main/base/interface/response';
import { getFileNameFromPath } from '../../main/base/interface/utils';
import { ENABLE_UPLOAD_DUPLICATED_FILE } from '../../main/base/settings/boolean_settings';
import {
  ErpRequestParseFile,
  IReqParseFile,
  RequestParseFile,
  TrdRequestParseFile,
} from '../../main/modules/parseFile/interface/channels';
import {
  IContentParsingFile,
  isContentEnd,
  isContentError,
  isContentSuccess,
} from '../../main/modules/parseFile/interface/content';
import { IParsingProgress } from '../../main/modules/parseFile/interface/rows';
import {
  ErpRequestSelectFile,
  RequestSelectFile,
  TrdRequestSelectFile,
} from '../../main/modules/selectFile/interface/channels';
import { IContentSelectFile } from '../../main/modules/selectFile/interface/response';
import { Menus, menuErpUpload, menuTrdUpload } from '../data/menuKeys';
import { IDataUpload } from '../data/menuUpload';
import { getSetting, renderProgressing } from '../utils';

import { CompConsole, IConsoleItem, makeItemFromMain, makeItemFromText } from './CompConsole';
import { CompUploadClick } from './CompUploadClick';
import CompUploadHistory, { IUploadItem } from './CompUploadHistory';

export interface MenuUploadErpDispatches {
  setConsoles: (key: Menus, item: IConsoleItem) => void;
  setUploaded: (key: Menus, item: IUploadItem) => void;
  setSizePct: (k: Menus, v: number) => void;
  setRowsPct: (k: Menus, v: number) => void;
}

/**
 * todo: [+++] 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const CompMenuUpload = (
  props: IDataUpload & MenuUploadErpDispatches & { isErp: boolean }
) => {
  const { isErp } = props;
  const key = isErp ? menuErpUpload : menuTrdUpload;
  const requestSelectFileChannel = isErp ? ErpRequestSelectFile : TrdRequestSelectFile;
  const requestParseFileChannel = isErp ? ErpRequestParseFile : TrdRequestParseFile;

  const pushMsg = (msg: IConsoleItem) => {
    props.setConsoles(key, msg);
  };

  const resetPct = () => {
    props.setSizePct(key, 0);
    props.setRowsPct(key, 0);
  };

  const updatePct = (progress: IParsingProgress) => {
    props.setSizePct(key, progress.sizePct);
    props.setRowsPct(key, progress.rowsPct);
  };

  const requestSelectFile = () =>
    new Promise<string | null>((resolve) => {
      console.log('selecting file');
      window.electron.request(RequestSelectFile, isErp);
      window.electron.once(requestSelectFileChannel, (res: IRes<IContentSelectFile>) => {
        console.log('received files return: ', res);
        const { filePaths } = res.content;
        if (filePaths.length === 0) return pushMsg(makeItemFromText('cancelled'));
        if (filePaths.length > 1)
          return pushMsg(makeItemFromText('should filePaths.length === 1', LogLevel.error));
        const fp = filePaths[0];
        // prettier-ignore
        pushMsg(makeItemFromMain(res, (c: IContentSelectFile) => `selected file: ${getFileNameFromPath(c.filePaths[0])}`));

        /**
         * check whether uploaded already
         */
        if (
          !getSetting('boolean', ENABLE_UPLOAD_DUPLICATED_FILE) &&
          props.uploaded.some((i) => getFileNameFromPath(fp) === i.fileName)
        )
          // prettier-ignore
          return pushMsg(makeItemFromText(`[UPLOAD DENY]: the file '${getFileNameFromPath(fp)}' has been uploaded!`, LogLevel.warn));

        /**
         * successfully return file path for later parsing
         */
        return resolve(fp);
      });
    });

  const requestParseFile = (req: IReqParseFile) =>
    new Promise<boolean>(() => {
      console.log('parsing file...'); // for placeholder
      const fileName = getFileNameFromPath(req.fp);

      window.electron.request(RequestParseFile, req);
      window.electron.on(requestParseFileChannel, (res: IRes<IContentParsingFile>) => {
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
          window.electron.removeChannel(requestParseFileChannel);
          if (content.progress)
            // if failed to pre-parse, then there is no `content.progress`
            pushMsg(makeItemFromText(renderProgressing(content.progress), LogLevel.info));
          resetPct();
          props.setUploaded(key, { fileName, updateTime: new Date() });
        } else throw new Error('impossible content type');
      });
    });

  const onClickUpload = async () => {
    const fp = await requestSelectFile();
    if (fp === null) return console.log('no valid file chose');
    return requestParseFile({ fp, isErp });
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'w-full m-8 overflow-auto'}>
      <CompUploadClick sizePct={props.sizePct} rowsPct={props.rowsPct} onClick={onClickUpload} />

      <CompConsole items={props.consoleItems} />

      <CompUploadHistory items={props.uploaded} />
    </div>
  );
};

export default CompMenuUpload;

import { Status } from '../../base/interface/errors';
import { LogLevel } from '../../base/interface/log';
import { IpcMainEvent, genRes, reply } from '../../base/interface/response';
import { mainGetSetting } from '../../base/settings';
import { SET_PARSE_FILE_RETURN_FREQ } from '../../base/settings/number_settings';

import { handleParseFileCenter } from './center';
import { IReqParseFile, RequestParseFile } from './interface/channels';
import { IContentEnd } from './interface/content';

export const handleParseFile = async (e: IpcMainEvent, req: IReqParseFile) => {
  let cnt = 0;
  const { fp } = req;

  await handleParseFileCenter({
    /**
     *  file path
     */
    fp,

    /**
     * file type: erp / trd
     */
    isErp: req.isErp,

    /**
     * pre-parsing rows error
     * @param {GenericError<ErrorPreParsingRows>} error
     */
    onPreParseRowsError: (error) => {
      reply(e, RequestParseFile, genRes(error, LogLevel.error));
      reply(e, RequestParseFile, genRes({ status: Status.OVER }));
    },

    onParsingException: (error) => {
      reply(e, RequestParseFile, genRes(error, LogLevel.error));
      reply(e, RequestParseFile, genRes({ status: Status.OVER }));
    },

    /**
     * parsing rows error
     * @param {GenericError<ErrorParsingRows>} error
     */
    onParsingRowsError: (error) => {
      reply(e, RequestParseFile, genRes(error, LogLevel.warn));
    },

    /**
     * parsing success
     */
    onData: (content) => {
      cnt += 1;
      if (cnt % mainGetSetting('number', SET_PARSE_FILE_RETURN_FREQ) === 1) {
        reply(e, RequestParseFile, genRes(content));
      }
    },

    /**
     * end, or exception
     */
    onEnd: (content: IContentEnd) => {
      reply(e, RequestParseFile, genRes(content));
    },
  });
};

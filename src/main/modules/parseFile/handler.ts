import { Status } from '../../base/interface/errors';
import { LogLevel } from '../../base/interface/log';
import { IpcMainEvent, genRes, reply } from '../../base/interface/response';
import { mainGetSetting } from '../../base/settings';
import { SET_PARSE_FILE_RETURN_FREQ } from '../../base/settings/number_settings';

import { handleParseFileCenter } from './center';
import { ErpRequestParseFile, IReqParseFile, TrdRequestParseFile } from './interface/channels';
import { IContentEnd } from './interface/content';

export const handleParseFile = async (e: IpcMainEvent, req: IReqParseFile) => {
  let cnt = 0;
  const { fp, isErp } = req;
  const replyChannel = isErp ? ErpRequestParseFile : TrdRequestParseFile;

  await handleParseFileCenter({
    /**
     *  file path
     */
    fp,

    /**
     * file type: erp / trd
     */
    isErp,

    /**
     * pre-parsing rows error
     * @param {GenericError<ErrorPreParsingRows>} error
     */
    onPreParseRowsError: (error) => {
      reply(e, replyChannel, genRes(error, LogLevel.error));
      reply(e, replyChannel, genRes({ status: Status.OVER }));
    },

    onParsingException: (error) => {
      reply(e, replyChannel, genRes(error, LogLevel.error));
      reply(e, replyChannel, genRes({ status: Status.OVER }));
    },

    /**
     * parsing rows error
     * @param {GenericError<ErrorParsingRows>} error
     */
    onParsingRowsError: (error) => {
      reply(e, replyChannel, genRes(error, LogLevel.warn));
    },

    /**
     * parsing success
     */
    onData: (content) => {
      cnt += 1;
      if (cnt % mainGetSetting('number', SET_PARSE_FILE_RETURN_FREQ) === 1) {
        reply(e, replyChannel, genRes(content));
      }
    },

    /**
     * end, or exception
     */
    onEnd: (content: IContentEnd) => {
      reply(e, replyChannel, genRes(content));
    },
  });
};

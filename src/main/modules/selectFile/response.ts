import { IResBase, LogLevel, genResBase } from '../base/response';

export interface IContentSelectFile {
  filePaths: string[];
}

/**
 * ref select file
 */
export interface IResSelectFile extends IResBase {
  level: LogLevel.info;
  content: IContentSelectFile;
}

export const genResSelectFile = (filePaths: string[]): IResSelectFile => ({
  ...genResBase(),
  ...{ level: LogLevel.info, content: { filePaths } },
});

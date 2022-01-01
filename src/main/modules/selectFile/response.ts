import { IResBase, Level, genResBase } from '../base/response';

/**
 * ref select file
 */
export interface IResSelectFile extends IResBase {
  level: Level.info;
  content: {
    filePaths: string[];
  };
}

export const genResSelectFile = (filePaths: string[]): IResSelectFile => ({
  ...genResBase(),
  ...{ level: Level.info, content: { filePaths } },
});

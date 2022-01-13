import { IConsoleItem } from '../components/CompConsole';
import { IUploadItem } from '../components/CompUploadHistory';

export interface IDataUpload {
  consoleItems: IConsoleItem[];
  uploaded: IUploadItem[];
  sizePct: number;
  rowsPct: number;
}

export const initDataErp = (): IDataUpload => ({
  consoleItems: [],
  uploaded: [],
  sizePct: 0,
  rowsPct: 0,
});

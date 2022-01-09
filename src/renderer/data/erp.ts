import { IConsoleItem } from '../components/Console';
import { IUploadItem } from '../components/UploadHistory';

export interface IDataErp {
  consoleItems: IConsoleItem[];
  uploaded: IUploadItem[];
  sizePct: number;
  rowsPct: number;
}

export const initDataErp = (): IDataErp => ({
  consoleItems: [],
  uploaded: [],
  sizePct: 0,
  rowsPct: 0,
});

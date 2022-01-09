import { IDataErp, initDataErp } from './erp';
import { IDataMenu, initDataMenu } from './menu';

export interface IDataCenter {
  menu: IDataMenu;
  erp: IDataErp;
}

export const initDataCenter = (): IDataCenter => ({
  menu: initDataMenu(),
  erp: initDataErp(),
});

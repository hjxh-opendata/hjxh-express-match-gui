import { IDataErp, initDataErp } from './erp';
import { IDataMenu, initDataMenu, menuErpUpload, menuTrdUpload } from './menu';

export interface IDataCenter {
  menu: IDataMenu;
  [menuErpUpload]: IDataErp;
  [menuTrdUpload]: IDataErp;
}

export const initDataCenter = (): IDataCenter => ({
  menu: initDataMenu(),
  [menuErpUpload]: initDataErp(),
  [menuTrdUpload]: initDataErp(),
});

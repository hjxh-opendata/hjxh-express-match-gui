import { IDataMenuFees, initDataMenuFees } from './menuFees';
import { IDataMenu, initDataMenu, menuErpUpload, menuFees, menuTrdUpload } from './menuKeys';
import { IDataUpload, initDataErp } from './menuUpload';

export interface IDataCenter {
  menu: IDataMenu;
  [menuErpUpload]: IDataUpload;
  [menuTrdUpload]: IDataUpload;
  [menuFees]: IDataMenuFees;
}

export const initDataCenter = (): IDataCenter => ({
  menu: initDataMenu(),
  [menuErpUpload]: initDataErp(),
  [menuTrdUpload]: initDataErp(),
  [menuFees]: initDataMenuFees(),
});

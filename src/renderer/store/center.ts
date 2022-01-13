import { MenuState, initMenuState, menuErpUpload, menuFees, menuTrdUpload } from './menu';
import { IDataMenuFees, initDataMenuFees } from './menuFees';
import { IDataUpload, initDataErp } from './menuUpload';

export interface IDataCenter {
  menu: MenuState;
  [menuErpUpload]: IDataUpload;
  [menuTrdUpload]: IDataUpload;
  [menuFees]: IDataMenuFees;
}

export const initDataCenter = (): IDataCenter => ({
  menu: initMenuState(),
  [menuErpUpload]: initDataErp(),
  [menuTrdUpload]: initDataErp(),
  [menuFees]: initDataMenuFees(),
});

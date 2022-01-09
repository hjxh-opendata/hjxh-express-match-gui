export const menuInstruction = 'MenuInstruction';
export type MenuInstruction = typeof menuInstruction;

export const menuErpUpload = 'MenuErpUpload';
export type MenuErpUpload = typeof menuErpUpload;

export const menuTrdUpload = 'MenuTrdUpload';
export type MenuTrdUpload = typeof menuTrdUpload;

export const menuDbView = 'MenuDBView';
export type MenuDBView = typeof menuDbView;

export const menus = [menuInstruction, menuErpUpload, menuTrdUpload, menuDbView] as const;
export type Menus = typeof menus[number];

export interface IDataMenu {
  curMenu: Menus;
}

export const initDataMenu = (): IDataMenu => ({
  curMenu: menuInstruction,
});

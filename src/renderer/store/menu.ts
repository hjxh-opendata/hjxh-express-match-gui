import { PayloadAction, Reducer } from '@reduxjs/toolkit';

/**
 * menus
 */
export const menuInstruction = 'MenuInstruction';
export type MenuInstruction = typeof menuInstruction;

export const menuErpUpload = 'MenuErpUpload';
export type MenuErpUpload = typeof menuErpUpload;

export const menuTrdUpload = 'MenuTrdUpload';
export type MenuTrdUpload = typeof menuTrdUpload;

export const menuDbView = 'MenuDBView';
export type MenuDBView = typeof menuDbView;

export const menuFees = 'MenuFeeView';
export type MenuFeeView = typeof menuFees;

export const menus = [menuInstruction, menuErpUpload, menuTrdUpload, menuDbView, menuFees] as const;
export type MenuType = typeof menus[number];

/**
 * menu actions
 */
export const SWITCH_MENU = 'SWITCH_MENU';
export type SWITCH_MENU = typeof SWITCH_MENU;
export type SwitchMenuActions = PayloadAction<MenuType, SWITCH_MENU>;

export type MenuAction = SwitchMenuActions;

export interface MenuState {
  curMenu: MenuType;
}

export const initMenuState = (): MenuState => ({
  curMenu: menuInstruction,
});

export const menusReducer: Reducer<MenuState, MenuAction> = (
  state: MenuState = initMenuState(),
  action: MenuAction
): MenuState => {
  console.log({ state, action });
  switch (action.type) {
    case SWITCH_MENU:
      return { ...state, curMenu: action.payload };
    default:
      return state;
  }
};

export default menusReducer;

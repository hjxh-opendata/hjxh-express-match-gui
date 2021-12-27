import { Component } from 'react';

export interface IMenuItem {
  key: string;
  content: string | Component;
}

export interface MenusProps {
  menuItems: IMenuItem[];
  curKey: string;
  onClick: (key: string) => any;
}

export const Menus = (props: MenusProps) => {
  return (
    <div>
      <div className={'inline-flex gap-2 px-4 mt-2'}>
        {props.menuItems.map((menuItem) => {
          return (
            <button
              key={menuItem.key}
              type="button"
              style={{
                color: menuItem.key === props.curKey ? 'white' : 'gray',
                background:
                  menuItem.key === props.curKey ? 'darkred' : 'lightpink',
              }}
              onClick={() => {
                props.onClick(menuItem.key);
              }}
            >
              {menuItem.content}
            </button>
          );
        })}
      </div>

      <div className="h-0.5 my-2 bg-white w-full" />
    </div>
  );
};

export default Menus;

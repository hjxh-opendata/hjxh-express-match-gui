import { useState } from 'react';
import MenusSimple, { IMenuItem } from './componnets/MenusSimple';
import { UploadErp } from './UploadErp';
import { UploadTrd } from './UploadTrd';

export const menuItems: IMenuItem[] = [
  { key: 'ERP', content: 'ERP' },
  { key: 'TRD', content: 'TRD' },
];

export default function App() {
  const [curKey, setCurKey] = useState(menuItems[0].key);

  return (
    <div className="h-screen w-screen flex flex-col" id="content">
      {/* menu */}
      <MenusSimple
        menuItems={menuItems}
        curKey={curKey}
        onClick={(k) => setCurKey(k)}
      />

      <div id={'content'} className={'doc flex-grow overflow-auto mx-auto'}>
        {curKey === 'ERP' && <UploadErp />}
        {curKey === 'TRD' && <UploadTrd />}
      </div>
    </div>
  );
}

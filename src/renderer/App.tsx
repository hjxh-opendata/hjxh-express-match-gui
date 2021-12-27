import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import MenusSimple, { IMenuItem } from './components/MenusSimple';
import { StepperIntro } from './components/StepperIntro';

import { UploadErp } from './UploadErp';
import { UploadTrd } from './UploadTrd';

import './styles/doc.scss';

export const menuItems: IMenuItem[] = [
  { key: 'ERP', content: 'ERP' },
  { key: 'TRD', content: 'TRD' },
];

export default function App() {
  const [curKey, setCurKey] = useState(menuItems[0].key as string);

  window.electron.ipcRenderer.once('ipc-example', console.log);
  window.electron.ipcRenderer.myPing();

  return (
    <div className="h-screen w-screen flex flex-col" id="content">
      <Tabs
        value={curKey}
        onChange={(_, v) => {
          setCurKey(v);
        }}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="nav` tabs example"
      >
        <Tab value={'ERP'} label="ERP" />
        <Tab value="TRD" label="TRD" />
      </Tabs>

      <div
        id={'content'}
        className={
          'doc flex-grow overflow-auto flex flex-wrap justify-center gap-10'
        }
      >
        <>
          {curKey === 'ERP' && <UploadErp />}
          {curKey === 'TRD' && <UploadTrd />}
        </>

        <StepperIntro />
      </div>
    </div>
  );
}

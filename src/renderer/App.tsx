import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { Ping } from '../main/modules/heartBeats/const';

import { StepperIntro } from './components/StepperIntro';

import { MenuDB } from './MenuDB';
import { MenuUploadErp } from './MenuUploadErp';
import { MenuUploadTrd } from './MenuUploadTrd';
import { getSettings } from './utils';

import './styles/doc.scss';

export enum MenuKey {
  ERP = 'ERP',
  TRD = 'TRD',
  DB = 'DB',
}

export default function App() {
  const [curKey, setCurKey] = useState(MenuKey.ERP as string);

  window.electron.once(Ping, console.log);
  window.electron.heartBeats();
  console.log({ globalSettings: getSettings() });

  return (
    <div className="h-screen w-screen flex flex-col" id="content">
      <Tabs
        value={curKey}
        onChange={(_, v) => {
          setCurKey(v);
        }}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="nav tabs example"
      >
        <Tab value={MenuKey.ERP} label="ERP" />
        <Tab value={MenuKey.TRD} label="TRD" />
        <Tab value={MenuKey.DB} label={'数据库'} />
      </Tabs>

      <div
        className={'doc max-h-full overflow-auto flex-auto flex flex-wrap justify-center gap-10'}
      >
        {curKey === MenuKey.ERP && (
          <>
            <MenuUploadErp />
            <StepperIntro />
          </>
        )}
        {curKey === MenuKey.TRD && <MenuUploadTrd />}
        {curKey === MenuKey.DB && <MenuDB />}
      </div>
    </div>
  );
}

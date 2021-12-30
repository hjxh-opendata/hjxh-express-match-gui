import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { Ping } from '../main/@types/channels';

import { StepperIntro } from './components/StepperIntro';

import { MenuKey } from './@types/menu';
import { UploadErp } from './UploadErp';
import { UploadTrd } from './UploadTrd';

import './styles/doc.scss';

export default function App() {
  const [curKey, setCurKey] = useState(MenuKey.ERP as string);

  window.electron.once(Ping, console.log);
  window.electron.heartBeats();

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
        <Tab value={'ERP'} label="ERP" />
        <Tab value="TRD" label="TRD" />
      </Tabs>

      <div
        className={'doc min-h-0 flex-auto flex flex-wrap justify-center gap-10'}
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

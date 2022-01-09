import { Tab, Tabs } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import { Ping } from '../main/modules/heartBeats/const';

import { IConsoleItem } from './components/Console';
import { StepperIntro } from './components/StepperIntro';
import { IUploadItem } from './components/UploadHistory';

import { MenuDB } from './MenuDB';
import { MenuUploadErp } from './MenuUploadErp';
import { MenuUploadTrd } from './MenuUploadTrd';
import { IDataCenter, initDataCenter } from './data/center';
import { menuDbView, menuErpUpload, menuInstruction, menuTrdUpload } from './data/menu';
import { getSettings } from './utils';

import './styles/doc.scss';

export default function App() {
  const [data, setData] = useState<IDataCenter>(initDataCenter());

  const setKey = (key, val) => {
    setData(_.merge({ ...data }, { [key]: val }));
  };

  useEffect(() => {
    /**
     * heartbeat
     */
    window.electron.once(Ping, console.log);
    window.electron.heartBeats();

    /**
     * global settings
     */
    console.log({ globalSettings: getSettings() });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col" id="content">
      <Tabs
        value={data.menu.curMenu}
        onChange={(_, v) => {
          setData({ ...data, menu: { curMenu: v } });
        }}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="nav tabs example"
      >
        <Tab value={menuInstruction} label={'使用指引'} />
        <Tab value={menuErpUpload} label="ERP" />
        <Tab value={menuTrdUpload} label="TRD" />
        <Tab value={menuDbView} label={'数据库'} />
      </Tabs>

      <div
        className={
          'doc min-w-1/2 max-h-full px-10 overflow-auto flex-auto flex flex-wrap justify-center gap-10'
        }
      >
        {data.menu.curMenu === menuInstruction && <StepperIntro />}
        {data.menu.curMenu === menuErpUpload && (
          <MenuUploadErp
            isFocused={data.menu.curMenu === menuErpUpload}
            uploaded={data.erp.uploaded}
            rowsPct={data.erp.rowsPct}
            sizePct={data.erp.sizePct}
            consoleItems={data.erp.consoleItems}
            setRowsPct={(v) => setKey('erp', { rowsPct: v })}
            setSizePct={(v) => setKey('erp', { sizePct: v })}
            setConsoles={(item: IConsoleItem) =>
              setKey('erp', { consoleItems: [...data.erp.consoleItems, item].slice(-100) })
            }
            setUploaded={(item: IUploadItem) =>
              setKey('erp', { uploaded: [...data.erp.uploaded, item].slice(-10) })
            }
          />
        )}
        {data.menu.curMenu === menuTrdUpload && <MenuUploadTrd />}
        {data.menu.curMenu === menuDbView && <MenuDB />}
      </div>
    </div>
  );
}

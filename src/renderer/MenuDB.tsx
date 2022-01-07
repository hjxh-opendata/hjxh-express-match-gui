import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { IErpItem } from '../main/modules/parseFile/handler/parse_success';
import { RequestQueryDatabase } from '../main/modules/queryDB/channels';
import { IReqQueryDB } from '../main/modules/queryDB/request';
import { IResQueryDB } from '../main/modules/queryDB/response';

export const MenuDB = () => {
  const [data, setData] = useState<IErpItem[]>([]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      width: 160,
    },
    {
      field: 'date',
      headerName: 'date',
    },
    {
      field: 'area',
      headerName: 'area',
    },
    {
      field: 'weight',
      headerName: 'weight',
      type: 'number',
    },
  ];

  const fetchData = (props: IReqQueryDB) => {
    console.log('querying database');
    window.electron.request(RequestQueryDatabase, props);
    window.electron.once(RequestQueryDatabase, (res: IResQueryDB) => {
      console.log({ msg: res });
      setData(res.content.items as IErpItem[]);
    });
  };

  useEffect(() => {
    fetchData({ skip: 0, limit: 1000 });
  }, []);

  return (
    <div className={'w-full h-full m-4'}>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
};

import { MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { IErpItem } from '../main/modules/parseFile/interface/item';
import { DataMode } from '../main/modules/queryDB/base';
import { IReqQueryDB, IResQueryDB, RequestQueryDatabase } from '../main/modules/queryDB/interface';

export const MenuDB = () => {
  const [data, setData] = useState<IErpItem[]>([]);

  const [mode, setMode] = useState<DataMode>(DataMode.onlyTrd);

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
    fetchData({ skip: 0, limit: 1000, mode });
  }, [mode]);

  return (
    <div className={'w-full h-full m-4'}>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={mode}
        label="Age"
        onChange={(v) => {
          console.log({ v });
          setMode(v.target.value as DataMode);
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={DataMode.onlyErp}>仅显示ERP</MenuItem>
        <MenuItem value={DataMode.onlyTrd}>仅显示TRD</MenuItem>
        <MenuItem value={DataMode.bothErpTrd}>ERP和TRD联表</MenuItem>
        <MenuItem value={DataMode.mismatched}>仅显示ERP和TRD不同时存在的数据</MenuItem>
      </Select>
      <DataGrid columns={columns} rows={data} />
    </div>
  );
};

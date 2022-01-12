import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { IErpItem } from '../../main/modules/parseFile/interface/item';
import { DataMode } from '../../main/modules/queryDB/base';
import {
  IReqQueryDB,
  IResQueryDB,
  RequestQueryDatabase,
} from '../../main/modules/queryDB/interface';

const columnsErp: GridColDef[] = [
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
  {
    field: 'cp',
    headerName: 'cp',
  },
];

const columnsTrd: GridColDef[] = [
  ...columnsErp,
  {
    field: 'fee',
    headerName: 'fee',
    type: 'number',
  },
];

const columnsJoin = [
  { field: 'id', headerName: 'id' },
  { field: 'date_erp', headerName: 'date_erp' },
  { field: 'date_trd', headerName: 'date_trd' },
  { field: 'area_erp', headerName: 'area_erp' },
  { field: 'area_trd', headerName: 'area_trd' },
  { field: 'weight_erp', headerName: 'weight_erp' },
  { field: 'weight_trd', headerName: 'weight_trd' },
  { field: 'cp_erp', headerName: 'cp_erp' },
  { field: 'cp_trd', headerName: 'cp_trd' },
  { field: 'fee_erp', headerName: 'fee_erp' },
  { field: 'fee_trd', headerName: 'fee_trd' },
];

export const CompMenuDB = () => {
  const [data, setData] = useState<IErpItem[]>([]);

  const [mode, setMode] = useState<DataMode>(DataMode.onlyTrd);

  let columns;
  switch (mode) {
    case DataMode.onlyErp:
      columns = columnsErp;
      break;
    case DataMode.onlyTrd:
      columns = columnsTrd;
      break;
    default:
      columns = columnsJoin;
      break;
  }

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
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">数据库模式</InputLabel>
        <Select
          className={'m-4'}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={mode}
          onChange={(v) => {
            console.log({ v });
            setMode(v.target.value as DataMode);
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={DataMode.onlyTrd}>仅显示TRD</MenuItem>
          <MenuItem value={DataMode.onlyErp}>仅显示ERP</MenuItem>
          <MenuItem value={DataMode.trdWithErp}>基于TRD显示联表</MenuItem>
          <MenuItem value={DataMode.erpWithTrd}>基于ERP显示联表</MenuItem>
          {/* <MenuItem value={DataMode.mismatched}>仅显示ERP和TRD不同时存在的数据</MenuItem> */}
        </Select>
      </FormControl>

      <DataGrid columns={columns} rows={data} />
    </div>
  );
};

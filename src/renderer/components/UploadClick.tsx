import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import React from 'react';

export interface UploadClick2Props {
  readPct: number;
  onClick: any;
}

export const UploadClick = (props: UploadClick2Props) => {
  return (
    <div
      className={'flex justify-center items-center'}
      style={{ width: 300, height: 200, border: '2px dashed' }}
    >
      {props.readPct ? (
        <CircularProgress value={props.readPct} />
      ) : (
        <div
          className={'flex justify-center items-center flex-col'}
          role={'button'}
          tabIndex={-1}
          aria-hidden
          id={'upload-area'}
          onClick={props.onClick}
        >
          <CloudUploadIcon fontSize={'large'} color={'primary'} />
          <div className={'text-center m-8 text-base'}>单击或拖拽文件上传</div>
        </div>
      )}
    </div>
  );
};

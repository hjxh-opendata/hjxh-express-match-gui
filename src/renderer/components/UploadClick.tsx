import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material';
import React from 'react';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          fontSize={'24px'}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export interface UploadClick2Props {
  readPct: number;
  onClick: any;
}

export const UploadClick = (props: UploadClick2Props) => {
  return (
    <div
      className={'flex justify-center items-center'}
      style={{ width: 300, height: 150, border: '2px dashed' }}
    >
      {props.readPct ? (
        <CircularProgressWithLabel value={props.readPct} size={100} />
      ) : (
        <div
          className={'w-full h-full flex justify-center items-center flex-col'}
          role={'button'}
          tabIndex={-1}
          aria-hidden
          id={'upload-area'}
          onClick={props.onClick}
        >
          <CloudUploadIcon fontSize={'large'} color={'primary'} />
          <div className={'text-center m-2 text-base'}>单击或拖拽文件上传</div>
        </div>
      )}
    </div>
  );
};

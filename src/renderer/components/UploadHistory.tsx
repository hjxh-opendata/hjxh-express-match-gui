import FolderIcon from '@mui/icons-material/Folder';
import React from 'react';

export interface IUploadItem {
  fileName: string;
  updateTime: Date;
  operator?: string;
}

interface UploadHistoryProps {
  items: IUploadItem[];
}

export const UploadHistory = ({ items }: UploadHistoryProps) => {
  return (
    <div
      id={'upload-history'}
      className={'flex flex-col items-center'}
      style={{ width: 300 }}
    >
      <div className={'text-center m-8 text-base'}>上传历史</div>
      <div className={'flex justify-center items-center flex-col'}>
        {items.length === 0 ? (
          <div>暂无</div>
        ) : (
          items.map((item) => (
            <div key={item.fileName} className={'inline-flex overflow-hidden'}>
              <FolderIcon className={'mx-4'} />
              <p>{item.fileName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadHistory;

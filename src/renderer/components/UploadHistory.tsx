import FolderIcon from '@mui/icons-material/Folder';
import React from 'react';

import { timeSince } from '../locales/utils';

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
      className={'w-full my-4 flex flex-col items-center'}
      style={{ minHeight: 50, maxHeight: 400, overflow: 'auto' }}
    >
      <div className={'flex justify-center items-start flex-col-reverse'}>
        {items.length === 0 ? (
          <div className={'text-center'}>
            <div className={'m-8 text-base'}>上传历史</div>
            <div>暂无</div>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.fileName} className={'inline-flex overflow-hidden'}>
              <FolderIcon className={'mx-4'} />
              <p>
                {item.fileName} ({timeSince(item.updateTime)})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadHistory;

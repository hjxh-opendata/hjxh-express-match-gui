import { MdWithDir } from './componnets/MdWithDir';
import docUploadBase from '../docs/upload_base.md';
import docUploadTrd from '../docs/upload_trd.md';

export const UploadTrd = () => {
  return (
    <div className={'flex'}>
      <div id={'upload-area'}></div>

      <div id={'upload-desc'}>
        <MdWithDir content={docUploadBase} />
        <MdWithDir content={docUploadTrd} />
      </div>
    </div>
  );
};

export default UploadTrd;

import { MdWithDir } from './componnets/MdWithDir';
import docUploadBase from '../docs/upload_base.md';
import docUploadErp from '../docs/upload_erp.md';
import Steps, { StepProps } from './componnets/Steps';
import { useState } from 'react';

const steps: StepProps[] = [
  {
    title: '导入文件',
    content: 'xx',
  },
  {
    title: '解析文件',
    content: 'xx',
  },
  {
    title: '上传文件',
    content: 'xx',
  },
];

export const UploadErp = () => {
  const [curStep, setCurStep] = useState(1);
  return (
    <div className={'flex'}>
      <div id={'upload-area'}>
        <Steps steps={steps} curStep={curStep} setCurStep={setCurStep} />
      </div>

      <div id={'upload-desc'}>
        <MdWithDir content={docUploadBase} />
        <MdWithDir content={docUploadErp} />
      </div>
    </div>
  );
};

export default UploadErp;

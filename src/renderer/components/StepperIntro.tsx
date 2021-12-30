import {
  Box,
  Button,
  Paper,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import Step from '@mui/material/Step';
import { useState } from 'react';

import docSysIntro from '../docs/sys_intro.md';
import docUploadBase from '../docs/upload_base.md';
import docUploadErp from '../docs/upload_erp.md';
import docUploadTrd from '../docs/upload_trd.md';

import { MdWithDir } from './MdWithDir';

const steps = [
  {
    label: '系统简介',
    description: (
      <div>
        <MdWithDir content={docSysIntro} />
      </div>
    ),
  },
  {
    label: '导入文件',
    description: (
      <div>
        <MdWithDir content={docUploadBase} />
        <MdWithDir content={docUploadErp} />
        <MdWithDir content={docUploadTrd} />
      </div>
    ),
  },
  {
    label: '解析文件',
    description: 'TODO: ',
  },
  {
    label: '上传数据',
    description: 'TODO: ',
  },
];

export const StepperIntro = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: 600 }} className={'max-h-full p-8 overflow-auto'}>
      <Stepper activeStep={activeStep} orientation={'vertical'}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant={'caption'}>Last Step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>

            <StepContent>
              {/* `component="span": https://stackoverflow.com/a/53494821/9422455 */}
              <Typography component={'span'}>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant={'contained'}
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finished' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>怎么样，你学会了吗~</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            再看一遍！
          </Button>
        </Paper>
      )}
    </Box>
  );
};

import { useState } from 'react';

export enum StepStatus {
  NotYet,
  Going,
  Finished,
}

interface IStep {
  seq: number;
  title: string;
  content: any;
  collapse: boolean;
  onNext: any;
  onBack: any;
  isLast: boolean;
}

export const Step = (props: IStep) => {
  return (
    <div className={'w-64'} style={{ minHeight: 'fit-content' }}>
      <div className={'step-title-row inline-flex'}>
        <div className={'w-4'}>{props.seq}</div>
        <div className={'text-2xl'}>{props.title}</div>
      </div>

      <div
        className={'step-content-row flex items-stretch'}
        style={{ minHeight: 'fit-content' }}
      >
        <div className={'w-4 h-full'}>
          {!props.collapse && (
            <div
              className={'bg-gray-400 h-full ml-1'}
              style={{ width: '2px' }}
            />
          )}
        </div>

        <div className={'flex flex-col'}>
          <div>{props.content}</div>
          {props.collapse ? (
            <div>TODO: </div>
          ) : (
            <div className={'flex gap-3'}>
              <button
                type={'button'}
                onClick={props.onNext}
                className={'bg-blue-500 text-white'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                下一步
              </button>
              <button
                type={'button'}
                disabled={props.seq === 1}
                onClick={props.onBack}
                className={'bg-gray-200 text-gray-500'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                上一步
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface StepProps {
  title: string;
  content: string;
}

export interface ISteps {
  steps: StepProps[];
  curStep: number;
  setCurStep: any;
}

export const Steps = (props: ISteps) => {
  return (
    <div className={'flex flex-col'}>
      {props.steps.map((step, i) => {
        return (
          <Step
            seq={i + 1}
            title={step.title}
            content={step.content}
            collapse={props.curStep !== i + 1}
            onNext={() => {
              props.setCurStep(props.curStep + 1);
            }}
            onBack={() => {
              props.setCurStep(props.curStep - 1);
            }}
            isLast={i === props.steps.length}
          />
        );
      })}
    </div>
  );
};

export default Steps;

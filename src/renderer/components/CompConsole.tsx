import React, { ElementRef, useEffect, useRef } from 'react';

import { LogLevel, getLogLevelInt } from '../../main/base/interface/log';
import { IRes } from '../../main/base/interface/response';

import ScrollToBottom from './MixinScrollToBottom';

export interface IConsoleItem {
  text: string;
  time: Date;
  level: LogLevel;
}

export interface ConsoleProps {
  items: IConsoleItem[];
}

export const CompConsole = ({ items }: ConsoleProps) => {
  const refScroll = useRef<ElementRef<typeof ScrollToBottom>>(null);

  useEffect(() => {
    refScroll?.current?.doScroll();
  });

  return (
    <div id={'upload-cmd'} className={'my-4 relative bg-pink-200'}>
      <div className={'absolute top-0 left-0 z-100 w-full bg-pink-500'}>
        <p className={'text-base text-white font-bold p-2'}> CONSOLE</p>
        <div className={'h-0.5 bg-white'} />
      </div>

      <div
        style={{ minHeight: 200, maxHeight: 400 }}
        className={'overflow-auto p-2 pt-12 text-black text-sm'}
      >
        {items.map((item, i) => (
          <p
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            style={{ textIndent: '-2em', marginLeft: '2em' }}
            className={`mr-2 text-pink-${getLogLevelInt(item.level) * 200 + 300}`}
          >
            {item.text}
          </p>
        ))}

        <ScrollToBottom ref={refScroll} />
      </div>
    </div>
  );
};

export const makeItemFromMain = (msg: IRes<any>, func?: (any) => string): IConsoleItem => {
  const { content } = msg;
  return {
    text: func ? func(content) : content.toString(),
    time: msg.sendTime,
    level: msg.level || LogLevel.debug,
  };
};

export const makeItemFromText = (text: string, level = LogLevel.debug): IConsoleItem => ({
  text,
  time: new Date(),
  level,
});

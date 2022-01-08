import React, { ElementRef, useEffect, useRef } from 'react';

import { IResBase, LogLevel, getLogLevel2number } from '../../main/base/response';

import ScrollToBottom from './ScrollToBottom';

export interface ConsoleItem {
  text: string;
  time: Date;
  level: LogLevel;
}

export interface ConsoleProps {
  items: ConsoleItem[];
}

export const Console = ({ items }: ConsoleProps) => {
  const refScroll = useRef<ElementRef<typeof ScrollToBottom>>(null);

  useEffect(() => {
    refScroll?.current?.doScroll();
  });

  return (
    <div id={'upload-cmd'} className={'my-4 relative bg-pink-200'} style={{ width: 600 }}>
      <div className={'absolute top-0 left-0 z-100 w-full bg-pink-500'}>
        <p className={'text-base text-white font-bold p-2'}> CONSOLE</p>
        <div className={'h-0.5 bg-white'} />
      </div>

      <div
        style={{ minHeight: 200, maxHeight: 400 }}
        className={'overflow-auto p-2 pt-12 text-black text-sm'}
      >
        {items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i} style={{ textIndent: '-2em', marginLeft: '2em' }}>
            <span className={`mr-2 text-pink-${getLogLevel2number(item.level) * 200 + 300}`}>
              {item.time.toLocaleString()}
            </span>
            <span> {item.text}</span>
          </p>
        ))}

        <ScrollToBottom ref={refScroll} />
      </div>
    </div>
  );
};

export const makeItemFromMain = (msg: IResBase, func?: (any) => string): ConsoleItem => {
  const text = msg.content ? msg.content : msg.error?.msg || '';
  return {
    text: func ? func(text) : text,
    time: msg.sendTime,
    level: msg.level || LogLevel.debug,
  };
};

export const makeItemFromText = (text: string, level = LogLevel.debug): ConsoleItem => ({
  text,
  time: new Date(),
  level,
});

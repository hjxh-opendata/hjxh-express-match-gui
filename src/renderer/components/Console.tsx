import React, { ElementRef, useEffect, useRef } from 'react';

import { ConsoleItem } from '../console';

import ScrollToBottom from './ScrollToBottom';

export interface ConsoleProps {
  items: ConsoleItem[];
}

export const Console = ({ items }: ConsoleProps) => {
  // TODO: init not only with `null`
  const refScroll = useRef<ElementRef<typeof ScrollToBottom>>(null);

  useEffect(() => {
    refScroll?.current?.doScroll();
  });

  return (
    <div
      id={'upload-cmd'}
      className={' mt-16 relative bg-pink-200'}
      style={{ width: 600 }}
    >
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
          <p key={i} style={{ textIndent: '2em' }}>
            <span className={`mr-2 text-pink-${item.level * 200 + 300}`}>
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

import { forwardRef, useImperativeHandle, useRef } from 'react';

export const ScrollToBottom = (_, ref) => {
  const doScroll = () => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'end',
      });
    }
  };

  useImperativeHandle(ref, () => ({
    doScroll,
  }));

  return <div ref={ref} />;
};

export default forwardRef(ScrollToBottom);

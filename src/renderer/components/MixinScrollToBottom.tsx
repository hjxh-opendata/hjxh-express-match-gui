import { forwardRef, useImperativeHandle, useRef } from 'react';

const makeScrollToBottomHandler = (refMe) => ({
  doScroll: () => {
    refMe.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'end',
    });
  },
});

const MixinScrollToBottom = (_, ref) => {
  const refMe = useRef(null as unknown as HTMLDivElement);

  useImperativeHandle(ref, () => makeScrollToBottomHandler(refMe));
  return <div ref={refMe} />;
};

export default forwardRef<ReturnType<typeof makeScrollToBottomHandler>>(MixinScrollToBottom);

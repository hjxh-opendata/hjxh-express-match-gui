import { useEffect, useRef } from 'react';

interface ScrollToBottomProps {
  id: string | number;
}
export const ScrollToBottom = ({ id }: ScrollToBottomProps) => {
  const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  const doScroll = () => {
    if (!ref.current) {
      console.warn('ref of scrollToBottom not prepared');
      return;
    }
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'end',
    });
  };

  useEffect(() => {
    doScroll();
  }, [id]);

  return <div ref={ref} />;
};

export default ScrollToBottom;

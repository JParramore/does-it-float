import { useEffect, useState, type RefObject } from 'react';
import {
  calculateScrollPosition,
  type ScrollPosition,
} from '../lib/calculate-scroll-position';

function useScrollPosition(
  ref: RefObject<HTMLElement | null>,
  visibleRows: number,
  initial: ScrollPosition,
) {
  const [position, setPosition] = useState(initial);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setPosition((p) =>
        calculateScrollPosition(event.deltaY, p.offset, p.anchor, visibleRows),
      );
    };
    // https://stackoverflow.com/questions/63663025/react-onwheel-handler-cant-preventdefault-because-its-a-passive-event-listener
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [ref, visibleRows]);

  return position;
}

export default useScrollPosition;

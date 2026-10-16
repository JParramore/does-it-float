import { useEffect, useState, type RefObject } from 'react';

function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);
  
  // https://stackoverflow.com/a/73954996
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => setHeight(element.clientHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return height;
}

export default useElementHeight;

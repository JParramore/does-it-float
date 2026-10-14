import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FloatRow } from './components/FloatRow';
import indexToEncoding from './lib/index-to-encoding';
import inspectEncoding from './lib/inspect-encoding';

function App() {
  const [scrollPosition, setScrollPosition] = useState<bigint>(1n << 63n);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const onWheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      console.log('deltaX:', event.deltaX)
      console.log('deltaY:', event.deltaY);
      console.log('deltaZ:', event.deltaZ);
      console.log('deltaMode:', event.deltaMode);

      setScrollPosition(prev => prev + BigInt(parseInt(event.deltaY.toString())));
    };
    currentRef.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => currentRef.removeEventListener('wheel', onWheelHandler);
  }, []);

  return <>
    <div className="scroll-container" ref={ref}>
      <p>Scroll Position: {scrollPosition.toString()}</p>
      <table>
        <thead>
          <tr>
            <th>Float</th>
            <th>Int</th>
            <th>Bin</th>
            <th>Sign</th>
            <th>Exp</th>
            <th>Man</th>
            <th>Hex</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          <FloatRow {...inspectEncoding(indexToEncoding(scrollPosition))} />
        </tbody>
      </table>
    </div>
  </>;
}

export default App;

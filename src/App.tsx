import { useRef, type CSSProperties } from 'react';
import './App.css';
import { FloatTable } from './components/FloatTable';
import useElementHeight from './hooks/useElementHeight';
import useScrollPosition from './hooks/useScrollPosition';
import { LAST_INDEX, ROW_HEIGHT } from './lib/constants';

const INITIAL_POSITION = { anchor: LAST_INDEX - 199n, offset: 0 };
// const INITIAL_POSITION = { anchor: 0n, offset: 0 };

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const height = useElementHeight(ref);
  const visibleRows = Math.floor((height - ROW_HEIGHT) / ROW_HEIGHT);
  const { anchor } = useScrollPosition(ref, visibleRows, INITIAL_POSITION);

  return (
    <div
      className="scroll-container"
      ref={ref}
      style={{ '--row-height': `${ROW_HEIGHT}px` } as CSSProperties}
    >
      <FloatTable anchor={anchor} rowCount={visibleRows} />
    </div>
  );
}

export default App;

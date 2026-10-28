import { useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { FloatTable } from './components/FloatTable';
import { LAST_INDEX, SCROLL_SCALE } from './lib/constants';
import parseDecimal from './lib/parse-decimal';
import decimalToEncoding from './lib/decimal-to-encoding';
import encodingToIndex from './lib/encoding-to-index';

const INPUT_MAX = 10000;
// const INITIAL_POSITION = { anchor: LAST_INDEX >> 1n, offset: 0 };
const INITIAL_POSITION = { anchor: BigInt(Number.MAX_SAFE_INTEGER), offset: 0 };
// const INITIAL_POSITION = { anchor: 0n, offset: 0 };
// const INITIAL_POSITION = { anchor: LAST_INDEX, offset: 0 };

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState(INITIAL_POSITION.anchor);
  const anchorRef = useRef<HTMLTableRowElement>(null);

  useLayoutEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'center' });
  }, [anchor])

  const onScroll = (value: string) => {
    const fraction = Number(value) / INPUT_MAX;
    const scaled = BigInt(Math.round(fraction * Number(SCROLL_SCALE)));
    setAnchor(scaled * LAST_INDEX / SCROLL_SCALE);
  }

  const onSearchValue = (value: string) => {
    const parsed = parseDecimal(value);
    if (parsed.kind === 'invalid') {
      console.warn(parsed.reason);
      return;
    }

    if (parsed.kind === 'infinity') {
      // get inf indexes on sign
      return;
    }

    if (parsed.kind === 'nan') {
      // get nan indexes on sign
      return;
    }

    const encoding = decimalToEncoding({ negative: parsed.negative, digits: parsed.digits, fractionDigits: parsed.fractionDigits });
    const index = encodingToIndex(encoding.encoding);
    setAnchor(index);
  }

  const scrollValue = INPUT_MAX * Number((anchor * SCROLL_SCALE) / LAST_INDEX) / Number(SCROLL_SCALE);
  return (
    <>
      <div className="searches">
        <input type="search" onChange={(e) => setAnchor(BigInt(e.currentTarget.value))} />
        <input type="search" onChange={(e) => onSearchValue(e.currentTarget.value)} />
      </div>
      <div
        className="scroll-container"
        ref={ref}
      >
        <FloatTable anchor={anchor} rowCount={100} anchorRef={anchorRef} />
      </div>
      <input type="range" className="scroll" min="0" value={scrollValue} max={INPUT_MAX} onChange={(e) => onScroll(e.currentTarget.value)} />
    </>
  );
}

export default App;

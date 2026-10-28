import { useLayoutEffect, useRef, useState, type SubmitEvent } from 'react';
import './App.css';
import { FloatTable } from './components/FloatTable';
import parseIndex from './lib/parse-index';
import searchValueToIndex from './lib/search-value-to-index';
import { indexToSliderValue, sliderValueToIndex } from './lib/slider-position';

const INPUT_MAX = 10000;
// const INITIAL_POSITION = { anchor: LAST_INDEX >> 1n, offset: 0 };
const INITIAL_POSITION = { anchor: BigInt(Number.MAX_SAFE_INTEGER), offset: 0 };
// const INITIAL_POSITION = { anchor: 0n, offset: 0 };
// const INITIAL_POSITION = { anchor: LAST_INDEX, offset: 0 };

function App() {
  const [anchor, setAnchor] = useState(INITIAL_POSITION.anchor);
  const anchorRef = useRef<HTMLTableRowElement>(null);

  useLayoutEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'center' });
  }, [anchor]);

  const jumpTo = (index: bigint | null) => {
    if (index !== null) setAnchor(index);
  };

  const onIndexSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const indexValue = new FormData(e.currentTarget).get('index')?.toString() ?? '';
    jumpTo(parseIndex(indexValue));
  };

  const onValueSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueValue = new FormData(e.currentTarget).get('value')?.toString() ?? '';
    const { index, outcome } = searchValueToIndex(valueValue);
    if (outcome !== 'exact') {
      console.warn(`${valueValue} does not float`);
    }
    jumpTo(index);
  };

  return (
    <div className="app">
      <div className="searches">
        <form onSubmit={onIndexSubmit}>
          <label>
            Index
            <input type="search" name="index" />
          </label>
          <button type="submit">find</button>
        </form>
        <form onSubmit={onValueSubmit}>
          <label>
            Value
            <input type="search" name="value" />
          </label>
          <button type="submit">find</button>
        </form>
      </div>
      <div className="scroll-container">
        <FloatTable anchor={anchor} rowCount={100} anchorRef={anchorRef} />
      </div>
      <input
        type="range"
        className="scroll"
        min="0"
        max={INPUT_MAX}
        value={indexToSliderValue(anchor, INPUT_MAX)}
        onChange={(e) => setAnchor(sliderValueToIndex(Number(e.currentTarget.value), INPUT_MAX))}
      />
    </div>
  );
}

export default App;

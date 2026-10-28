import { useDeferredValue, useLayoutEffect, useRef, useState, type SubmitEvent } from 'react';
import './App.css';
import { FloatTable } from './components/FloatTable';
import parseIndex from './lib/parse-index';
import searchValueToIndex from './lib/search-value-to-index';
import { indexToSliderValue, sliderValueToIndex } from './lib/slider-position';

const INPUT_MAX = 10000;
const INITIAL_POSITION = { anchor: 0n, offset: 0 };
const ROWS_EACH_SIDE = 100;

function App() {
  const [anchor, setAnchor] = useState(INITIAL_POSITION.anchor);
  const deferredAnchor = useDeferredValue(anchor);
  const anchorRef = useRef<HTMLTableRowElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'center' });
  }, [deferredAnchor]);

  // Near either end of the rendered rows? Make the row in the middle of the view the new anchor.
  const onTableScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const spaceBelow = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (container.scrollTop > container.clientHeight && spaceBelow > container.clientHeight) return;

    const box = container.getBoundingClientRect();
    const middleRow = document
      .elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
      ?.closest<HTMLTableRowElement>('tr[data-index]');
    if (middleRow?.dataset.index) setAnchor(BigInt(middleRow.dataset.index));
  };

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
      <div className="scroll-container" ref={containerRef} onScroll={onTableScroll}>
        <FloatTable anchor={deferredAnchor} rowCount={ROWS_EACH_SIDE} anchorRef={anchorRef} />
      </div>
      <input
        type="range"
        className="scroll"
        min="0"
        max={INPUT_MAX}
        value={indexToSliderValue(anchor, INPUT_MAX)}
        onChange={(e) => jumpTo(sliderValueToIndex(Number(e.currentTarget.value), INPUT_MAX))}
      />
    </div>
  );
}

export default App;

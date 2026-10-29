import { useDeferredValue, useLayoutEffect, useRef, useState, type SubmitEvent } from 'react';
import './App.css';
import { FloatTable } from './components/FloatTable';
import parseIndex from './lib/parse-index';
import searchValueToIndex from './lib/search-value-to-index';
import outcomeMessage from './lib/outcome-message';
import { indexToSliderValue, sliderValueToIndex } from './lib/slider-position';

const INPUT_MAX = 10000;
const INITIAL_POSITION = { anchor: 0n, offset: 0 };
const ROWS_EACH_SIDE = 100;

function App() {
  const [anchor, setAnchor] = useState(INITIAL_POSITION.anchor);
  const deferredAnchor = useDeferredValue(anchor);
  const anchorRef = useRef<HTMLTableRowElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const shouldFlash = useRef(false);

  useLayoutEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'center' });
    if (shouldFlash.current) {
      anchorRef.current?.animate(
        [
          { backgroundColor: outcome === 'exact' ? 'green' : 'grey' },
          { backgroundColor: 'transparent' }
        ],
        {
          duration: 1500,
          easing: 'ease-out'
        }
      );
      shouldFlash.current = false;
    }
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

  const jumpTo = (index: bigint | null, flash = false) => {
    if (index === null) return;
    if (flash && index !== anchor) shouldFlash.current = true;
    setAnchor(index);
  };

  const onValueSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { index, outcome } = searchValueToIndex(e.currentTarget.value);
    setOutcome(outcome);
    jumpTo(index, true);
  };

  return (
    <div className="app">
      <div className="searches">
        <h1>
          Every Float64 <small>all 2<sup>64</sup> IEEE 754 doubles, in order</small>
        </h1>
          <label>
            search 
            <input onChange={onValueSubmit} type="search" name="value" />
          </label>
          <span className={outcome !== 'exact' ? 'outcome-false' : 'outcome-exact'} role="status">{outcomeMessage(outcome)}</span>
        <a className="repo-link" href="https://github.com/JParramore/does-it-float" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </a>
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

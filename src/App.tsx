import { useState } from 'react';
import { FloatRow } from './components/FloatRow';
import inspectFloat from './lib/inspect-float';
import nextEncoding from './lib/next-encoding';
import './App.css';
import previousEncoding from './lib/previous-encoding';

const floats = [
  { label: '0', f: 0 },
  { label: '0.01', f: 0.01 },
  { label: '16', f: 16 },
  { label: '1.0', f: 1.0 },
  { label: 'MIN_VALUE', f: Number.MIN_VALUE },
  { label: '-MIN_VALUE', f: -Number.MIN_VALUE },
  { label: 'MAX_VALUE', f: Number.MAX_VALUE },
  { label: 'POSITIVE_INFINITY', f: Number.POSITIVE_INFINITY },
  { label: 'NEGATIVE_INFINITY', f: Number.NEGATIVE_INFINITY },
  { label: 'NaN', f: Number.NaN },
  { label: 'incrementFloat(POSITIVE_INFINITY)', f: Number.POSITIVE_INFINITY, inc: true },
  { label: 'increment 0', f: 0, inc: true },
  { label: 'increment -0', f: -0, inc: true }
].map((f, i) => {
  let fl
  if (f.inc) {
    fl = nextEncoding(inspectFloat(f.f));
  } else {
    fl = inspectFloat(f.f);
  }
  return { key: '' + i, label: f.label, ...fl }
})

function App() {
  const [selected, setSelected] = useState(floats[0]);
  const [current, setCurrent] = useState(floats[0]);

  const setSelectedAndCurrent = (f: typeof floats[0]) => {
    setSelected(f);
    setCurrent(f);
  };

  return <>
    <select value={selected.key} onChange={e => setSelectedAndCurrent(floats.find(f => f.key === e.target.value)!)}>
      {
        floats.map(f => {
          return <option key={f.key} value={f.key}>
            {`${f.label} (${f.hex})`}
          </option>
        })
      }
    </select>
    <button onClick={() => setCurrent({ key: '', label: 'next', ...nextEncoding(current) })}>Next Encoding</button>
    <button onClick={() => setCurrent({ key: '', label: 'previous', ...previousEncoding(current) })}>Previous Encoding</button>
    <FloatRow
      {...current}
    />
  </>;
}

export default App;

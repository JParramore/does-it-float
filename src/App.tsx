import { useState } from 'react';
import { FloatRow } from './components/FloatRow';
import inspectFloat from './lib/inspect-float';
import nextEncoding from './lib/increment-float';
import './App.css';

const floats = [
  { label: '0', f: 0 },
  { label: '0.01', f: 0.01 },
  { label: '16', f: 16 },
  { label: '1.0', f: 1.0 },
  { label: 'MIN_VALUE', f: Number.MIN_VALUE },
  { label: 'MAX_VALUE', f: Number.MAX_VALUE },
  { label: 'POSITIVE_INFINITY', f: Number.POSITIVE_INFINITY },
  { label: 'NEGATIVE_INFINITY', f: Number.NEGATIVE_INFINITY },
  { label: 'NaN', f: Number.NaN },
  { label: 'incrementFloat(POSITIVE_INFINITY)', f: Number.POSITIVE_INFINITY, inc: true },
  { label: 'increment 0', f: 0, inc: true },
  { label: 'increment -0', f: -0, inc: true }
].map(f => {
  let fl
  if (f.inc) {
    fl = nextEncoding(inspectFloat(f.f));
  } else {
    fl = inspectFloat(f.f);
  }
  return { label: f.label, ...fl }
})

function App() {
  const [selected, useSelected] = useState(floats[0]);
  return <>
    <select value={selected.hex} onChange={e => useSelected(floats.find(f => f.hex === e.target.value)!)}>
      {
        floats.map(f => {
          return <option key={f.hex} value={f.hex}>
            {`${f.label} (${f.hex})`}
          </option>
        })
      }
    </select>
    <FloatRow
      {...selected}
    />
  </>;
}

export default App;

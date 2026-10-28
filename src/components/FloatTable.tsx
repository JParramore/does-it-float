import { memo, useMemo } from 'react';
import computeRows from '../lib/compute-rows';
import { FloatRow } from './FloatRow';

type FloatTableProps = { anchor: bigint; rowCount: number, anchorRef: React.RefObject<HTMLTableRowElement | null> };

export const FloatTable = memo(({ anchor, rowCount, anchorRef }: FloatTableProps) => {
  const rows = useMemo(() => computeRows(anchor, rowCount), [anchor, rowCount]);

  return (
    <table>
      <thead>
        <tr>
          <th>index</th>
          <th>precise float</th>
          <th>hex</th>
          <th>classification</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <FloatRow key={row.hex} row={row} anchorRef={row.index === anchor ? anchorRef : null} />
        ))}
      </tbody>
    </table>
  );
});

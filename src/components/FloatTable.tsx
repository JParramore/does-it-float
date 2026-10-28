import { useMemo } from 'react';
import computeRows from '../lib/compute-rows';
import { FloatRow } from './FloatRow';

type FloatTableProps = { anchor: bigint; rowCount: number, anchorRef: React.RefObject<HTMLTableRowElement | null> };

export const FloatTable = ({ anchor, rowCount, anchorRef }: FloatTableProps) => {
  const rows = useMemo(() => computeRows(anchor, rowCount), [anchor, rowCount]);

  return (
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Precise Float</th>
          <th>Hex</th>
          <th>Classification</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <FloatRow key={row.hex} row={row} anchorRef={row.index === anchor ? anchorRef : null} /> 
        ))}
      </tbody>
    </table>
  );
};

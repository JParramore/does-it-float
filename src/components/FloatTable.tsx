import { useMemo } from 'react';
import computeRows from '../lib/compute-rows';
import { FloatRow } from './FloatRow';

type FloatTableProps = { anchor: bigint; rowCount: number };

export const FloatTable = ({ anchor, rowCount }: FloatTableProps) => {
  const rows = useMemo(() => computeRows(anchor, rowCount), [anchor, rowCount]);

  return (
    <table>
      <thead>
        <tr>
          <th>Index</th>
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
        {rows.map((row) => (
          <FloatRow key={row.hex} row={row} />
        ))}
      </tbody>
    </table>
  );
};

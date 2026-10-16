import type { Row } from '../lib/compute-rows';

type FloatRowProps = { row: Row };

export const FloatRow = ({ row }: FloatRowProps) => (
  <tr>
    <td>{row.index}</td>
    <td>{row.float}</td>
    <td>{row.int}</td>
    <td>{row.bin}</td>
    <td>{row.sign}</td>
    <td>{row.exp}</td>
    <td>{row.man}</td>
    <td>{row.hex}</td>
    <td>{row.classification}</td>
  </tr>
);

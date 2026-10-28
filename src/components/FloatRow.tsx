import type { Row } from '../lib/compute-rows';

type FloatRowProps = { row: Row, anchorRef: React.RefObject<HTMLTableRowElement | null> | null };

export const FloatRow = ({ row, anchorRef }: FloatRowProps) => (
  <tr ref={anchorRef}>
    <td>{row.index}</td>
    <td>{row.exact}</td>
    <td>{row.int}</td>
    <td>{row.bin}</td>
    <td>{row.sign}</td>
    <td>{row.exp}</td>
    <td>{row.man}</td>
    <td>{row.hex}</td>
    <td>{row.classification}</td>
  </tr>
);

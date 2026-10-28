import type { Row } from '../lib/compute-rows';

type FloatRowProps = { row: Row, anchorRef: React.RefObject<HTMLTableRowElement | null> | null };

export const FloatRow = ({ row, anchorRef }: FloatRowProps) => (
  // data-index lets App find a row's index from the DOM when working out where we've scrolled to
  <tr ref={anchorRef} data-index={row.index.toString()}>
    <td>{row.index}</td>
    <td>{row.exact}</td>
    <td>{row.hex}</td>
    <td>{row.classification}</td>
  </tr>
);

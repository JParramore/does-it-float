import { LAST_INDEX } from './constants';
import exactDecimal from './exact-decimal';
import type Float from './float';
import indexToEncoding from './index-to-encoding';
import inspectEncoding from './inspect-encoding';
import nextEncoding from './next-encoding';
import previousEncoding from './previous-encoding';

export type Row = Float & { index: bigint; exact: string };

const computeRows = (anchor: bigint, count: number): Row[] => {
  let value: Float = inspectEncoding(indexToEncoding(anchor));
  const rows: Row[] = [{ index: anchor, exact: exactDecimal(value.int), ...value }];

  let pos = value;
  let neg = value;
  for (let i = 1; i < count; i++) {
    const pIndex = anchor + BigInt(i);
    const nIndex = anchor + BigInt(-i);
    // Check each side before stepping, so neither walks past an end and one end doesn't stop the other side.
    if (pIndex <= LAST_INDEX) {
      pos = nextEncoding(pos);
      rows.push({ index: pIndex, exact: exactDecimal(pos.int), ...pos });
    }
    if (nIndex >= 0n) {
      neg = previousEncoding(neg);
      rows.unshift({ index: nIndex, exact: exactDecimal(neg.int), ...neg });
    }
  }

  return rows;
};

export default computeRows;

import { LAST_INDEX } from './constants';
import exactDecimal from './exact-decimal';
import type Float from './float';
import indexToEncoding from './index-to-encoding';
import inspectEncoding from './inspect-encoding';
import nextEncoding from './next-encoding';

export type Row = Float & { index: bigint; exact: string };

const computeRows = (anchor: bigint, count: number): Row[] => {
  const rows: Row[] = [];
  let value: Float = inspectEncoding(indexToEncoding(anchor));

  for (let i = 0; i < count; i++) {
    const index = anchor + BigInt(i);
    rows.push({ index, exact: exactDecimal(value.int), ...value });
    if (index === LAST_INDEX) break;
    value = nextEncoding(value);
  }

  return rows;
};

export default computeRows;

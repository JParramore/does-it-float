import type { Row } from '../lib/compute-rows';

const getPaddedZeros = (index: bigint) => {
  const maxLen = BigInt(2) ** BigInt(64);
  const indexStr = index.toString();
  const maxLenStr = maxLen.toString();
  return '0'.repeat(maxLenStr.length - indexStr.length);
}

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="14" height="14" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

type FloatRowProps = { row: Row, anchorRef: React.RefObject<HTMLTableRowElement | null> | null };

export const FloatRow = ({ row, anchorRef }: FloatRowProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  // data-index lets App find a row's index from the DOM when working out where we've scrolled to
  return (
    <tr ref={anchorRef} data-index={row.index.toString()}>
      <td>
        <span className="padded-zeros">
          {getPaddedZeros(row.index)}
        </span>
        {row.index}
      </td>
      <td>
        <div className="exact-value">
          {row.exact}
          <button className="copy-button" title="Copy to Clipboard" aria-label="Copy exact value" onClick={() => copyToClipboard(row.exact)}>
            <CopyIcon />
          </button>
        </div>
      </td>
      <td>{`0x${row.hex}`}</td>
      <td>{row.classification}</td>
    </tr>
  );
}

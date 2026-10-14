import type Float from "../lib/float";
import nextEncoding from "../lib/next-encoding";

type FloatRowProps = Float;

export const FloatRow = (float: FloatRowProps) => {

  const rows = [];
  rows.push(float);
  let val = float;
  for (let i = 0; i < 100; i++) {
    val = nextEncoding(val);
    rows.push(val);
  }

  return (
    <>
      {
        rows.map((row, index) => (
          <tr key={index}>
            <td>{row.float}</td>
            <td>{row.int}</td>
            <td>{row.bin}</td>
            <td>{row.sign}</td>
            <td>{row.exp}</td>
            <td>{row.man}</td>
            <td>{row.hex}</td>
            <td>{row.classification}</td>
          </tr>
        ))
      }
    </>
  );
} 
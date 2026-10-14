import type Float from "../lib/float";

type FloatRowProps = Float;

export const FloatRow = ({ float, int, bin, sign, exp, man, hex, classification }: FloatRowProps) => {
  return (
    <tr>
      <td>{float}</td>
      <td>{int}</td>
      <td>{bin}</td>
      <td>{sign}</td>
      <td>{exp}</td>
      <td>{man}</td>
      <td>{hex}</td>
      <td>{classification}</td>
    </tr>
  );
} 
import type Float from "../lib/float";

type FloatRowProps = Float;

export const FloatRow = ({ float, int, bin, sign, exp, man, hex, classification }: FloatRowProps) => {
  return (
    <dl>
      <dt>float</dt>
      <dd>{float}</dd>
      <dt>int</dt>
      <dd>{int}</dd>
      <dt>bin</dt>
      <dd>{bin}</dd>
      <dt>sign</dt>
      <dd>{sign}</dd>
      <dt>exp</dt>
      <dd>{exp}</dd>
      <dt>man</dt>
      <dd>{man}</dd>
      <dt>hex</dt>
      <dd>{hex}</dd>
      <dt>classification</dt>
      <dd>{classification}</dd>
    </dl>
  );
} 
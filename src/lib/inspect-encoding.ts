import decodeFloat from "./decode-float";
import getClassification from "./get-classification";

const inspectEncoding = (value: bigint) => {
  const bits = value.toString(2).padStart(64, '0');
  const float = decodeFloat(value);
  return {
    float: float,
    int: value,
    bin: bits,
    sign: bits[0],
    exp: bits.slice(1, 12),
    man: bits.slice(12),
    hex: value.toString(16).padStart(16, '0'),
    classification: getClassification(bits),
  };
}

export default inspectEncoding;
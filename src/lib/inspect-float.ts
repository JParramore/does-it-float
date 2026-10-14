import encodeFloat from "./encode-float";
import type Float from "./float";
import inspectEncoding from "./inspect-encoding";

const inspectFloat = (value: number): Float => {
  const raw = encodeFloat(value);
  return inspectEncoding(raw);
};

export default inspectFloat;

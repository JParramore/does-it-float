import encodeFloat from "./encode-float";
import inspectEncoding from "./inspect-encoding";
import type Float from "./float";

const previousEncoding = (value: Float): Float => {
  if (Object.is(value.float, -0)) {
    const e = encodeFloat(-Number.MIN_VALUE);
    return inspectEncoding(e);
  }

  if (Object.is(value.float, 0)) {
    const e = encodeFloat(-0);
    return inspectEncoding(e);
  }

  const inc = value.int >> 63n === 0n ? value.int - 1n : value.int + 1n;
  return inspectEncoding(inc);
};

export default previousEncoding;

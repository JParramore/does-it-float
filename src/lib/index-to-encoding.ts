import { HALF, ENCODING_COUNT } from "./constants";

const indexToEncoding = (index: bigint): bigint => {
  if (index < 0n || index >= ENCODING_COUNT) {
    throw new RangeError(`index out of range: ${index}`);
  }

  return index < HALF
    ? ENCODING_COUNT - 1n - index // if the index is in the first half, map it to the mirrored position in the second half
    : index - HALF; // if the index is in the second half, map it to the corresponding position in the first half
};

export default indexToEncoding;

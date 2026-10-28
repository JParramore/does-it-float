import { ENCODING_COUNT, HALF } from "./constants";

const encodingToIndex = (encoding: bigint): bigint => {
  return encoding < HALF
    ? encoding + HALF
    : ENCODING_COUNT - 1n - encoding;
}

export default encodingToIndex;
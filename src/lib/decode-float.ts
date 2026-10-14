const decodeFloat = (encoded: bigint): number => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, encoded);
  return view.getFloat64(0);
};

export default decodeFloat;
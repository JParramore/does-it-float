const encodeFloat = (value: number): bigint => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);
  return view.getBigUint64(0);
};

export default encodeFloat;
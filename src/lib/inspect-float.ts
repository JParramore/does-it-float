const getClassification = (bits: string) => {
  const sign = bits[0];
  const exp = bits.slice(1, 12);
  const man = bits.slice(12);

  if (exp === '11111111111') {
    if (man === '0000000000000000000000000000000000000000000000000000') {
      return sign === '0' ? 'Positive Infinity' : 'Negative Infinity';
    }
    return 'NaN';
  }

  if (exp === '00000000000') {
    if (man === '0000000000000000000000000000000000000000000000000000') {
      return sign === '0' ? 'Positive Zero' : 'Negative Zero';
    }
    return 'Subnormal';
  }

  return 'Normal';
};

const inspectFloat = (value: number) => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  view.setFloat64(0, value);

  const raw = view.getBigUint64(0);
  const bits = raw.toString(2).padStart(64, '0');

  return {
    float: view.getFloat64(0).toString(),
    int: raw.toString(),
    bin: bits,
    sign: bits[0],
    exp: bits.slice(1, 12),
    man: bits.slice(12),
    hex: raw.toString(16).padStart(16, '0'),
    class: getClassification(bits),
  };
};

export default inspectFloat;

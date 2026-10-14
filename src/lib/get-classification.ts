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

export default getClassification;
type ParsedDecimal =
  | { kind: 'finite'; negative: boolean; digits: bigint; fractionDigits: number }
  | { kind: 'infinity'; negative: boolean }
  | { kind: 'nan'; negative: boolean }
  | { kind: 'invalid'; reason: string };

const parseDecimal = (value: string): ParsedDecimal => {
  value = value.toLowerCase();
  let sign: string;

  if (value.startsWith('-')) {
    sign = '1';
    value = value.slice(1);
  } else {
    sign = '0';
    // '+' means positive, so drop it and carry on like there was no sign
    if (value.startsWith('+')) {
      value = value.slice(1);
    }
  }

  if (value === 'infinity') {
    return {
      kind: 'infinity',
      negative: sign === '1'
    }
  }

  // which NaN encoding this lands on is decided by the search, not the parser
  if (value === 'nan') {
    return {
      kind: 'nan',
      negative: sign === '1'
    }
  }

  // the regex allows every part to be empty, so '' and '.' would get through and BigInt('') is 0n
  if (!/^\d*\.?\d*$/.test(value) || !/\d/.test(value)) {
    return {
      kind: 'invalid',
      reason: 'Invalid number format'
    };
  }

  const intDigits: string = value.split('.')[0];
  const fracDigits: string = value.split('.')[1] || '';

  const fractionDigits = fracDigits.length;
  const digits = BigInt(intDigits + fracDigits);

  return {
    kind: 'finite',
    negative: sign === '1',
    digits,
    fractionDigits
  }
};

export default parseDecimal;

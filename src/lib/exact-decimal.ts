const FRACTION_BITS = 52n;
const EXPONENT_BITS = 11n;
const EXPONENT_BIAS = 1023n;

const FRACTION_MASK = (1n << FRACTION_BITS) - 1n;
const EXPONENT_MASK = (1n << EXPONENT_BITS) - 1n;

const exactDecimal = (encoding: bigint): string => {
  // 1. Extract the three fields from the 64-bit encoding.
  const signBit = encoding >> 63n;
  const exponentBits = (encoding >> 52n) & EXPONENT_MASK;
  const fractionBits = encoding & FRACTION_MASK;

  const isNegative = signBit === 1n;

  // 2. Handle special exponent patterns.
  // An exponent of all 1s means Infinity or NaN.
  if (exponentBits === EXPONENT_MASK) {
    if (fractionBits !== 0n) {
      return 'NaN';
    }

    return isNegative ? '-Infinity' : 'Infinity';
  }

  // An exponent of all 0s, with a zero fraction, means +0 or -0.
  if (exponentBits === 0n && fractionBits === 0n) {
    return isNegative ? '-0' : '0';
  }

  // 3. Decode the stored fields into:
  //
  //   integerSignificand × 2^binaryExponent
  //
  // This form lets us do everything using exact integer arithmetic.

  let integerSignificand: bigint;
  let binaryExponent: bigint;

  if (exponentBits === 0n) {
    // Subnormal:
    // - No implicit leading 1.
    // - The exponent is fixed at -1022.
    // - The 52 fraction bits represent a fraction / 2^52.

    integerSignificand = fractionBits;

    const minimumNormalExponent = 1n - EXPONENT_BIAS;
    binaryExponent = minimumNormalExponent - FRACTION_BITS;
  } else {
    // Normal:
    // - The significand has an implicit leading 1.
    // - The exponent uses a bias of 1023.
    // - The 52 fraction bits represent a fraction / 2^52.

    const implicitLeadingOne = 1n << FRACTION_BITS;
    integerSignificand = implicitLeadingOne + fractionBits;

    const unbiasedExponent = exponentBits - EXPONENT_BIAS;
    binaryExponent = unbiasedExponent - FRACTION_BITS;
  }

  // 4. Apply the sign after calculating the magnitude.
  const signPrefix = isNegative ? '-' : '';

  // 5. Convert integerSignificand × 2^binaryExponent
  // into an exact decimal string.

  if (binaryExponent >= 0n) {
    // Multiplication by 2^n is equivalent to shifting left by n.
    const integerValue = integerSignificand * (2n ** binaryExponent);

    return signPrefix + integerValue.toString();
  }

  // A negative exponent means division by a power of 2.
  //
  // Example:
  //   3 × 2^-3 = 3 / 8
  //
  // We want a decimal denominator (power of 10).
  //
  //   3 / 8
  //   = (3 × 5^3) / (8 × 5^3)
  //   = 375 / 1000
  //   = 0.375

  const decimalPlaces = -binaryExponent;

  const decimalNumerator =
    integerSignificand * (5n ** decimalPlaces);

  // The exact result is:
  //
  //   decimalNumerator / 10^decimalPlaces
  //
  // So we can insert the decimal point decimalPlaces
  // digits from the right.

  const numeratorDigits = decimalNumerator.toString();

  // Ensure there are enough digits for the decimal point.
  // Example: 5 / 1000 needs "0005" before splitting.
  const paddedDigits = numeratorDigits.padStart(
    Number(decimalPlaces) + 1,
    '0',
  );

  const decimalPointPosition =
    paddedDigits.length - Number(decimalPlaces);

  const integerPart = paddedDigits.slice(0, decimalPointPosition);

  const fractionalPart = paddedDigits.slice(decimalPointPosition);

  // Remove trailing fractional zeros for a canonical representation.
  // This doesn't lose precision: 1.500 and 1.5 are the same number.
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');

  if (trimmedFractionalPart.length === 0) {
    return signPrefix + integerPart;
  }

  return signPrefix + integerPart + '.' + trimmedFractionalPart;
};

export default exactDecimal;

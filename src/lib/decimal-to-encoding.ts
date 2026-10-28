const FRACTION_BITS = 52;
const BIAS = 1023;
const MIN_E = 1 - BIAS; // -1022, the lowest normal section; subnormals share its tick gap
const MAX_E = BIAS; // 1023, the highest section; anything from 2^1024 up is past the last tick
const HIDDEN_ONE = 1n << BigInt(FRACTION_BITS);

type FiniteDecimal = { negative: boolean; digits: bigint; fractionDigits: number };

export type DecimalOutcome = 'exact' | 'roundedUp' | 'roundedDown' | 'overflow' | 'underflow';

// x = num / den. Is x < 2^e? Multiply both sides until nothing is a fraction, then compare whole numbers.
const isBelowPowerOfTwo = (num: bigint, den: bigint, e: number) =>
  e >= 0 ? num < den << BigInt(e) : num << BigInt(-e) < den;

const bitLength = (n: bigint) => n.toString(2).length;

// TODO: Claude spat this out as a first pass, haven't taken a look yet, working but not fully understood, go back.
const decimalToEncoding = ({ negative, digits, fractionDigits }: FiniteDecimal) => {
  const signBit = negative ? 1n << 63n : 0n;

  if (digits === 0n) return { encoding: signBit, outcome: 'exact' as DecimalOutcome };

  // Work with the size of x and put the sign back at the end: rounding to nearest is the same both sides of zero.
  const num = digits;
  const den = 10n ** BigInt(fractionDigits);

  // Step 1: which section? Find e with 2^e <= x < 2^(e+1).
  // The difference in bit lengths is within one of the answer, so estimate then correct.
  let e = bitLength(num) - bitLength(den);
  while (isBelowPowerOfTwo(num, den, e)) e--;
  while (!isBelowPowerOfTwo(num, den, e + 1)) e++;

  const infinity = { encoding: signBit | (0x7ffn << 52n), outcome: 'overflow' as DecimalOutcome };
  if (e > MAX_E) return infinity;

  // Below the normal sections the ticks keep the gap of the lowest normal section, so measure in that section.
  const section = Math.max(e, MIN_E);
  const gapPower = section - FRACTION_BITS; // gap between ticks in this section is 2^gapPower

  // Step 2: which tick? x / gap = tick number + leftover. Scale both sides to whole numbers again.
  const scaledNum = gapPower < 0 ? num << BigInt(-gapPower) : num;
  const scaledDen = gapPower < 0 ? den : den << BigInt(gapPower);
  let tick = scaledNum / scaledDen; // the tick at or below x
  const leftover = scaledNum % scaledDen; // how far past that tick, as a fraction leftover / scaledDen of a gap

  // Closer tick: compare the leftover with half a gap (2 * leftover vs one gap). On an exact tie, pick the even tick.
  const roundUp = 2n * leftover > scaledDen || (2n * leftover === scaledDen && tick % 2n === 1n);
  if (roundUp) tick++;

  // Rounding up from the last tick of a section lands on the first tick of the next one.
  let finalSection = section;
  if (tick === HIDDEN_ONE << 1n) {
    tick = HIDDEN_ONE;
    finalSection++;
  }
  if (finalSection > MAX_E) return infinity;

  // Normal numbers have the hidden 1 (tick >= 2^52); subnormals don't and use exponent field 0.
  const exponentField = tick >= HIDDEN_ONE ? BigInt(finalSection + BIAS) : 0n;
  const fraction = tick >= HIDDEN_ONE ? tick - HIDDEN_ONE : tick;
  const encoding = signBit | (exponentField << 52n) | fraction;

  let outcome: DecimalOutcome = 'exact';
  if (tick === 0n) outcome = 'underflow';
  else if (leftover !== 0n) {
    // Rounding the size up makes a negative value smaller, so flip the direction for negatives.
    outcome = roundUp !== negative ? 'roundedUp' : 'roundedDown';
  }

  return { encoding, outcome };
};

export default decimalToEncoding;

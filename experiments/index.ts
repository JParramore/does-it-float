const inspectFloat = (value: number) => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  view.setFloat64(0, value);

  const raw = view.getBigUint64(0);
  const bits = raw.toString(2).padStart(64, '0');

  return {
    float: view.getFloat64(0),
    int: raw,
    bin: bits,
    sign: bits[0],
    exp: bits.slice(1, 12),
    man: bits.slice(12),
    hex: raw.toString(16).padStart(16, '0'),
    class: getClassification(bits),
  };
};

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
const inspectBits = (bits: string) => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  const raw = BigInt('0b' + bits);
  view.setBigUint64(0, raw);

  return {
    float: view.getFloat64(0),
    int: raw,
    bin: bits,
    sign: bits[0],
    exp: bits.slice(1, 12),
    man: bits.slice(12),
    hex: raw.toString(16).padStart(16, '0'),
    class: getClassification(bits),
  };
};

console.log(
  inspectBits(
    '0111111111111000000000000000000000000000000000000000000000000001',
  ),
);
console.log(
  inspectBits(
    '0111111111111000000000000000000000000000000000000000000000000010',
  ),
);

// console.log(inspectFloat(1.5))
// console.log(inspectFloat(2))
// console.log(inspectFloat(32))
// console.log(inspectFloat(11110))
// console.log(inspectFloat(-50))
// console.log(inspectFloat(0.1))

const inspectIncrementFloat = (value: number) => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  view.setFloat64(0, value);

  const bigInt = view.getBigUint64(0);
  const inc = bigInt + 1n;

  const buffer2 = new ArrayBuffer(8);
  const view2 = new DataView(buffer2);

  view2.setBigUint64(0, inc);

  const raw = view.getBigUint64(0);
  const bits = raw.toString(2).padStart(64, '0');
  const raw2 = view2.getBigUint64(0);
  const bits2 = raw2.toString(2).padStart(64, '0');

  const newFloat = view2.getFloat64(0);

  return {
    raw,
    bits,
    raw2,
    bits2,
    ogFloat: value,
    newFloat,
  };
};

// console.log(inspectIncrementFloat(1.5))
// console.log(inspectIncrementFloat(2))
// console.log(inspectIncrementFloat(200))
// console.log(inspectIncrementFloat(-12))
// console.log(inspectIncrementFloat(Number.MAX_SAFE_INTEGER));
// console.log(inspectIncrementFloat(Number.POSITIVE_INFINITY))

const incrementFloat = (value: number): number => {
  // Create a buffer to store og float
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);
  // Read as bigInt to make incrementing and exponent rollover easy
  const bigInt = view.getBigUint64(0);

  if (Object.is(value, -0)) {
    return 0;
  }

  if (Object.is(value, 0)) {
    return Number.MIN_VALUE;
  }

  const inc = bigInt >> 63n === 0n ? bigInt + 1n : bigInt - 1n;
  view.setBigUint64(0, inc);
  // Write over buffer w/ new value and out
  return view.getFloat64(0);
};

const decrementFloat = (value: number): number => {
  // Create a buffer to store og float
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);

  // Read as bigInt to make incrementing and exponent rollover easy
  const bigInt = view.getBigUint64(0);

  if (Object.is(value, 0)) {
    return -0;
  }

  if (Object.is(value, -0)) {
    return -Number.MIN_VALUE;
  }

  const dec = bigInt >> 63n === 0n ? bigInt - 1n : bigInt + 1n;
  view.setBigUint64(0, dec);
  // Write over buffer w/ new value and out
  return view.getFloat64(0);
};

// let val = Number.MIN_VALUE;
// console.log(inspectFloat(val))
// for (let i = 0; i < 4; i++) {
//   const tmp = decrementFloat(val);
//   const gap = tmp - val;
//   console.log(`${tmp} (+${gap})`);
//   console.log(inspectFloat(tmp))
//   val = tmp;
// }

// console.log('------')
// let val2 = -Number.MIN_VALUE;
// console.log(inspectFloat(val2))
// for (let i = 0; i < 3; i++) {
//   const tmp = incrementFloat(val2);
//   const gap = tmp - val2;
//   console.log(`${tmp} (+${gap})`);
//   console.log(inspectFloat(tmp))
//   val2 = tmp;
// }
// console.log(inspectFloat(-Number.MIN_VALUE))

// const la2 = incrementFloat(2.0)
// const lb2 = decrementFloat(2.0);

// let val = 2 ** -1022;
// val = incrementFloat(val);
// val = incrementFloat(val);
// for (let i = 0; i < 6; i++){
//   console.log(inspectFloat(val));
//   val = decrementFloat(val);
// }

const max = Number.MAX_VALUE;
const min = Number.MIN_VALUE;

for (let i = 0; i < 10; i++) {
  const next = incrementFloat(max);
  const gap = next - max;
  console.log(inspectFloat(next));
  console.log(`${next} (+${gap})`);
}
for (let i = 0; i < 10; i++) {
  const next = decrementFloat(min);
  const gap = next - min;
  console.log(inspectFloat(next));
  console.log(`${next} (+${gap})`);
}

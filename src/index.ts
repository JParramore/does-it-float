
const inspectFloat = (value: number) => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  view.setFloat64(0, value);

  const raw = view.getBigUint64(0)
  const bits = raw.toString(2).padStart(64, "0");

  return {
    float: view.getFloat64(0),
    int: raw,
    bin: bits,
    sign: bits[0],
    exp: bits.slice(1, 12),
    man: bits.slice(12),
    hex: raw.toString(16).padStart(16, "0"),
  }
}

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

  const buffer2 = new ArrayBuffer(8)
  const view2 = new DataView(buffer2);

  view2.setBigUint64(0, inc)

  const raw = view.getBigUint64(0)
  const bits = raw.toString(2).padStart(64, "0");
  const raw2 = view2.getBigUint64(0)
  const bits2 = raw2.toString(2).padStart(64, "0");

  const newFloat = view2.getFloat64(0);

  return {
    raw,
    bits,
    raw2,
    bits2,
    ogFloat: value,
    newFloat,
  }
}


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

  if (value === 0 && bigInt.toString(2).padStart(64, "0")[0] === "1") {
    return 0;
  }

  if (value === 0 && bigInt.toString(2).padStart(64, "0")[0] === "0") {
    return Number.MIN_VALUE;
  }

  const inc = value > 0 ? bigInt + 1n : bigInt - 1n;
  view.setBigUint64(0, inc)
  // Write over buffer w/ new value and out
  return view.getFloat64(0);
}

const decrementFloat = (value: number): number => {
  // Create a buffer to store og float
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);

  // Read as bigInt to make incrementing and exponent rollover easy
  const bigInt = view.getBigUint64(0);

  if (value === 0 && bigInt.toString(2).padStart(64, "0")[0] === "0") {
    return -0;
  }

  if (value === 0 && bigInt.toString(2).padStart(64, "0")[0] === "1") {
    return -Number.MIN_VALUE;
  }

  const dec = value > 0 ? bigInt - 1n : bigInt + 1n;
  view.setBigUint64(0, dec)
  // Write over buffer w/ new value and out
  return view.getFloat64(0);
}

let val = Number.MIN_VALUE;
console.log(inspectFloat(val))
for (let i = 0; i < 4; i++) {
  const tmp = decrementFloat(val);
  const gap = tmp - val;
  console.log(`${tmp} (+${gap})`);
  console.log(inspectFloat(tmp))
  val = tmp;
}

console.log('------')
let val2 = -Number.MIN_VALUE;
console.log(inspectFloat(val2))
for (let i = 0; i < 3; i++) {
  const tmp = incrementFloat(val2);
  const gap = tmp - val2;
  console.log(`${tmp} (+${gap})`);
  console.log(inspectFloat(tmp))
  val2 = tmp;
}
// console.log(inspectFloat(-Number.MIN_VALUE))

// const la2 = incrementFloat(2.0)
// const lb2 = decrementFloat(2.0);

// console.log(inspectFloat(la2))
// console.log(inspectFloat(lb2))
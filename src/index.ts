
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

console.log(inspectFloat(1.5))
console.log(inspectFloat(2))
console.log(inspectFloat(32))
console.log(inspectFloat(11110))
console.log(inspectFloat(-50))
console.log(inspectFloat(0.1))
import { describe, expect, it } from 'vitest';
import exactDecimal from './exact-decimal';

const view = new DataView(new ArrayBuffer(8));
const bitsOf = (x: number): bigint => {
  view.setFloat64(0, x);
  return view.getBigUint64(0);
};
const exactOf = (x: number) => exactDecimal(bitsOf(x));

describe('exactDecimal', () => {
  it.each([
    [0.1, '0.1000000000000000055511151231257827021181583404541015625'],
    [0.2, '0.200000000000000011102230246251565404236316680908203125'],
    [0.3, '0.299999999999999988897769753748434595763683319091796875'],
    [1, '1'],
    [1.5, '1.5'],
    [0.75, '0.75'],
    [0.0625, '0.0625'],
    [-2.5, '-2.5'],
    [8, '8'],
    [1e21, '1000000000000000000000'],
  ])('shows %s exactly', (x, expected) => {
    expect(exactOf(x)).toBe(expected);
  });

  it('keeps the sign of zero', () => {
    expect(exactOf(0)).toBe('0');
    expect(exactOf(-0)).toBe('-0');
  });

  it('shows infinities by name', () => {
    expect(exactOf(Infinity)).toBe('Infinity');
    expect(exactOf(-Infinity)).toBe('-Infinity');
  });

  it.each([
    ['quiet NaN', 0x7ff8000000000000n],
    ['NaN with payload 1', 0x7ff0000000000001n],
    ['negative NaN', 0xfff8000000000000n],
    ['all ones', 0xffffffffffffffffn],
  ])('shows %s as NaN', (_, bits) => {
    expect(exactDecimal(bits)).toBe('NaN');
  });
});

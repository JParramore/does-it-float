import { LAST_INDEX, SCROLL_SCALE } from './constants';

// The slider is a plain number from 0 to max; the list is 2^64 indexes. These convert between the two.

export const sliderValueToIndex = (value: number, max: number): bigint => {
  const fraction = value / max;
  const scaled = BigInt(Math.round(fraction * Number(SCROLL_SCALE)));
  return (scaled * LAST_INDEX) / SCROLL_SCALE;
};

export const indexToSliderValue = (index: bigint, max: number): number =>
  (max * Number((index * SCROLL_SCALE) / LAST_INDEX)) / Number(SCROLL_SCALE);

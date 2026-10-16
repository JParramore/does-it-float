import { LAST_INDEX, ROW_HEIGHT } from './constants';

export type ScrollPosition = { anchor: bigint; offset: number };

export const calculateScrollPosition = (
  deltaY: number,
  pOffset: number,
  pAnchor: bigint,
  visible: number,
): ScrollPosition => {
  const delta = pOffset + deltaY;
  const anchor = pAnchor + BigInt(Math.floor(delta / ROW_HEIGHT));
  const offset = ((delta % ROW_HEIGHT) + ROW_HEIGHT) % ROW_HEIGHT;

  return clampScrollPosition(anchor, offset, visible);
};

const clampScrollPosition = (
  anchor: bigint,
  offset: number,
  visible: number,
): ScrollPosition => {
  const maxAnchor = LAST_INDEX - BigInt(visible - 1);
  // If we're at the start of the table don't want to be able to scroll up
  if (anchor < 0n) {
    return { anchor: 0n, offset: 0 };
  }
  // At the bottom of the table don't want to be able to scroll down, max ancor needs to be last possible row minus the number of rows we can see.
  // Don't really like this. Don't know how we'd pin bottom row when in view though.
  if (anchor > maxAnchor) {
    return { anchor: maxAnchor, offset: 0 };
  }

  return { anchor, offset };
};

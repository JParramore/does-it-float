import { LAST_INDEX } from './constants';

// Not used any longer. We removed index search. Keeping it around incase it's helpful later.
const parseIndex = (text: string): bigint | null => {
  if (text.trim() === '') return null;

  let index: bigint;
  try {
    index = BigInt(text);
  } catch {
    console.debug('Invaid bigint in parseIndex');
    return null; // idk you can 'cheesecake' the search and it's harmless but supress the throw
  }

  // out-of-range indexes for if we put something mental in the search
  return index >= 0n && index <= LAST_INDEX ? index : null;
};

export default parseIndex;

import decimalToEncoding from './decimal-to-encoding';
import encodingToIndex from './encoding-to-index';
import parseDecimal from './parse-decimal';

const searchValueToIndex = (text: string): { outcome: string, index: bigint | null } => {
  const parsed = parseDecimal(text);
  if (parsed.kind === 'invalid') {
    console.warn(parsed.reason);
    return { outcome: 'invalid', index: null };
  }

  if (parsed.kind === 'infinity') {
    console.log('Searched +/-Infinity, I might implement this but probably not')
    return { outcome: 'infinity', index: null };
  }

  if (parsed.kind === 'nan') {
    console.log('Searched NaN, I might implement this but probably not')
    return { outcome: 'nan', index: null };
  }

  const {encoding, outcome} = decimalToEncoding(parsed);

  return { outcome, index: encodingToIndex(encoding)};
};

export default searchValueToIndex;

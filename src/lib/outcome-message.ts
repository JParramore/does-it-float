const outcomeMessage = (outcome: string | null) => {
  if (outcome === null) return null;
  if (outcome === 'exact') return 'floats';
  if (outcome === 'invalid') return 'not a valid number';
  return 'does not float';
};

export default outcomeMessage;
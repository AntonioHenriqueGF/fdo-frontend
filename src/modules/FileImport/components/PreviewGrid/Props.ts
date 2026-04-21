export const numericToAlfabeticColumnIndex = (index: number): string => {
  if (index < 0) {
    throw new Error('Index must be a non-negative integer');
  }
  if (index > 25) {
    throw new Error('Index must be 25 or less');
  }
  return String.fromCharCode(65 + index);
};
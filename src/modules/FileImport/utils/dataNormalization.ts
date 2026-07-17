import type { DataType, IParsingProfile } from '../interfaces/IParsingProfile';

type NormalizedRow = Record<DataType, string | number | undefined>;

/**
 * Converts a string formatted as "3.000,00" or "3,000.00" into a number.
 * 
 * Heuristic:
 * 1. Identify which character (dot or comma) appears last. 
 * 2. Treat that last character as the decimal separator.
 * 3. Treat the other character as the thousands separator (and remove it).
 */
const parseLocaleFloat = (value: string): number => {
  if (!value) return 0;

  // 1. Remove everything except digits, dots, commas, and the minus sign
  let cleanValue = value.replace(/[^\d.,-]/g, '');

  const lastComma = cleanValue.lastIndexOf(',');
  const lastDot = cleanValue.lastIndexOf('.');

  // 2. Determine which one is the decimal separator
  if (lastComma > lastDot) {
    // Case: 3.000,00 -> Comma is decimal, Dot is thousands
    cleanValue = cleanValue
      .replace(/\./g, '')    // Remove all dots (thousands)
      .replace(',', '.');    // Replace comma with dot (decimal)
  } else if (lastDot > lastComma) {
    // Case: 3,000.00 -> Dot is decimal, Comma is thousands
    cleanValue = cleanValue
      .replace(/,/g, '');    // Remove all commas (thousands)
  } else {
    // Case: No separators or only one type that we'll assume is decimal
    // If only a comma exists, we must convert it to a dot for parseFloat
    cleanValue = cleanValue.replace(',', '.');
  }

  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

export const validateProfile = (parsingProfile: IParsingProfile): boolean => {
  const { columnTypeMappings } = parsingProfile;

  if (columnTypeMappings.length === 0) {
    throw new Error('No column type mappings provided in the parsing profile.');
  }

  if (!columnTypeMappings.some(dataType => dataType === 'description')) {
    throw new Error('At least one column must be mapped to the "description" data type.');
  }

  if (!columnTypeMappings.some(dataType => dataType === 'amount' || dataType === 'credit_only' || dataType === 'debit_only')) {
    throw new Error('At least one column must be mapped to a data type that represents an amount (amount, credit, or debit).');
  }

  if (!columnTypeMappings.some(dataType => dataType === 'date_ddmmyyyy' || dataType === 'date_mmddyyyy' || dataType === 'date_yyyymmdd')) {
    throw new Error('At least one column must be mapped to a date data type.');
  }

  return true;
};

export const normalizeData = (rawData: string[][], parsingProfile: IParsingProfile): NormalizedRow[] => {
  const { dataLine, columnTypeMappings } = parsingProfile;

  const lastRowEmpty = isLastRowEmpty(rawData);

  const data = rawData.slice(dataLine - 1, lastRowEmpty ? -1 : undefined); // Convert 1-based index to 0-based

  const normalizedData: NormalizedRow[] = [];

  const indexToDataTypeMap: Record<number, DataType> = {};
  columnTypeMappings.forEach((dataType, index) => {
    indexToDataTypeMap[index] = dataType;
  });

  data.forEach(row => {
    const normalizedRow: NormalizedRow = {} as NormalizedRow;
    row.forEach((cell, index) => {
      const dataType = indexToDataTypeMap[index];
      if (cell?.length === 0) {
        return;
      }
      if ((['amount', 'credit_only', 'debit_only', 'closing_balance'] as DataType[]).includes(dataType) && cell) {
        normalizedRow[dataType] = parseFloat(parseLocaleFloat(cell).toFixed(2));
        return;
      }
      if (dataType === 'date_ddmmyyyy') {
        const [dd, mm, yyyy] = cell.split(/[-\/.]/);
        if (dd && mm && yyyy) {
          normalizedRow.date_yyyymmdd = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
          return;
        }
      }
      if (dataType === 'date_mmddyyyy') {
        const [mm, dd, yyyy] = cell.split(/[-\/.]/);
        if (dd && mm && yyyy) {
          normalizedRow.date_yyyymmdd = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
          return;
        }
      }
      if (dataType && dataType !== 'ignore') {
        normalizedRow[dataType] = cell;
      }
    });
    normalizedData.push(normalizedRow);
  });

  return normalizedData;
};

export const isLastRowEmpty = (rawData: string[][]): boolean => {
  if (!rawData || rawData.length === 0) return false;
  const lastRow = rawData[rawData.length - 1];
  return lastRow.every(cell => (cell ?? '').trim().length === 0);
};
import type { DataType, IParsingProfile } from '../interfaces/IParsingProfile';

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

  if (!columnTypeMappings.some(mapping => mapping.dataType === 'description')) {
    throw new Error('At least one column must be mapped to the "description" data type.');
  }

  if (!columnTypeMappings.some(mapping => mapping.dataType === 'amount' || mapping.dataType === 'credit_only' || mapping.dataType === 'debit_only')) {
    throw new Error('At least one column must be mapped to a data type that represents an amount (amount, credit, or debit).');
  }

  if (!columnTypeMappings.some(mapping => mapping.dataType === 'date_ddmmyyyy' || mapping.dataType === 'date_mmddyyyy' || mapping.dataType === 'date_yyyymmdd')) {
    throw new Error('At least one column must be mapped to a date data type.');
  }

  return true;
};

export const normalizeData = (rawData: string[][], parsingProfile: IParsingProfile): Record<DataType, string>[] => {
  const { dataLine, columnTypeMappings } = parsingProfile;

  const data = rawData.slice(dataLine - 1); // Convert 1-based index to 0-based
  console.log('Raw Data:', rawData,'Data to be normalized:', data);

  const normalizedData: Record<DataType, string>[] = [];

  const indexToDataTypeMap: Record<number, DataType> = {};
  columnTypeMappings.forEach(mapping => {
    indexToDataTypeMap[mapping.columnIndex] = mapping.dataType;
  });

  data.forEach(row => {
    const normalizedRow: Record<DataType, string> = {
      amount: '',
      credit_only: '',
      debit_only: '',
      closing_balance: '',
      closing_balance_description: '',
      date_yyyymmdd: '',
      description: '',
    } as Record<DataType, string>;
    row.forEach((cell, index) => {
      const dataType = indexToDataTypeMap[index];
      if ((dataType === 'amount' || dataType === 'credit_only' || dataType === 'debit_only') && cell) {
        normalizedRow[dataType] = parseLocaleFloat(cell).toFixed(2);
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
        return;
      }
    });
    normalizedData.push(normalizedRow);
  });

  return normalizedData;
};
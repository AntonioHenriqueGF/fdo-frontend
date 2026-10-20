import { describe, it, expect } from 'vitest';
import { isLastRowEmpty, normalizeData } from './dataNormalization';
import type { IParsingProfile } from '../interfaces/IParsingProfile';

describe('normalizeData', () => {
  it('should normalize the data provided', () => {
    const rawDataMatrix = [
      ['01/04/2025', 'Transaction Description', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should ignore headers and start from dataLine provided', () => {
    const rawDataMatrix = [
      ['Header Date', 'Header Description', 'Header Amount'],
      ['01/04/2025', 'Transaction Description', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 2,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should handle empty data gracefully', () => {
    const rawDataMatrix = [] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([]);
  });

  it('should handle rows with ignored columns correctly', () => {
    const rawDataMatrix = [
      ['01/04/2025', 'Transaction Description', 'Filler column', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'ignore', 'amount'],
    } satisfies IParsingProfile;
    const normilazedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normilazedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should equate columnTypeMappings null to ignore', () => {
    const rawDataMatrix = [
      [
        '01/04/2025',
        'Transaction Description',
        'Filler column',
        '100.00',
        'Another filling column',
      ],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: [
        'date_ddmmyyyy',
        'description',
        'ignore',
        'amount',
        null,
      ],
    } as IParsingProfile;
    const normilazedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normilazedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should convert ammounts for other number formats', () => {
    const rawDataMatrix = [
      ['100.0', '100,00', '$ 100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['amount', 'credit_only', 'debit_only'],
    } satisfies IParsingProfile;
    const normilazedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normilazedData).toEqual([
      {
        amount: 100.0,
        credit_only: 100.0,
        debit_only: 100.0,
      },
    ]);
  });

  it('should support DD/MM/YYYY date format', () => {
    const rawDataMatrix = [
      ['01/04/2025', 'Transaction Description', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should support MM/DD/YYYY date format', () => {
    const rawDataMatrix = [
      ['04/01/2025', 'Transaction Description', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_mmddyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should support YYYY-MM-DD date format', () => {
    const rawDataMatrix = [
      ['2025-04-01', 'Transaction Description', '100.00'],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_yyyymmdd', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    expect(normalizedData).toEqual([
      {
        date_yyyymmdd: '2025-04-01',
        description: 'Transaction Description',
        amount: 100.0,
      },
    ]);
  });

  it('should support enforce max string length of 255', () => {
    const rawDataMatrix = [
      [
        '01/04/2025',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
        '100.00',
      ],
    ] satisfies string[][];
    const parsingProfile = {
      dataLine: 1,
      columnTypeMappings: ['date_ddmmyyyy', 'description', 'amount'],
    } satisfies IParsingProfile;
    const normalizedData = normalizeData(rawDataMatrix, parsingProfile);
    const normalizedDescription = normalizedData[0].description as string;
    expect(normalizedDescription.length).toEqual(255);
  });
});

describe('isLastRowEmpty', () => {
  it('should correctly identify if the last row is empty', () => {
    const rawDataMatrix = [
      ['01/04/2025', 'Transaction Description', '100.00'],
      ['', '', ''],
    ] satisfies string[][];
    const result = isLastRowEmpty(rawDataMatrix);
    expect(result).toBe(true);
  });

  it('should correctly identify if the last row is not empty', () => {
    const rawDataMatrix = [
      ['01/04/2025', 'Transaction Description', '100.00'],
      ['02/04/2025', 'Another Transaction', '200.00'],
    ] satisfies string[][];
    const result = isLastRowEmpty(rawDataMatrix);
    expect(result).toBe(false);
  });
});

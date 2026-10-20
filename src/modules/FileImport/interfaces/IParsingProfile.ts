export type DataType =
  | 'date_mmddyyyy'
  | 'date_ddmmyyyy'
  | 'date_yyyymmdd'
  | 'description'
  | 'amount'
  | 'credit_only'
  | 'debit_only'
  | 'closing_balance'
  | 'ignore';

export interface IColumnTypeMapping {
  columnIndex: number;
  dataType: DataType;
}

export interface IParsingProfile {
  /**
   * The line number in the raw data matrix where the actual data starts. Starts from 1.
   */
  dataLine: number;

  /**
   * The indicator of what column stands at what position relative to the raw data matrix provided.
   */
  columnTypeMappings: DataType[];
}

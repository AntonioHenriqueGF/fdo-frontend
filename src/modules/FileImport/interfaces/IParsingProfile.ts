export type DataType = 'date_mmddyyyy' 
    | 'date_ddmmyyyy' 
    | 'date_yyyymmdd' 
    | 'description' 
    | 'amount' 
    | 'credit_only' 
    | 'debit_only' 
    | 'closing_balance' 
    | 'closing_balance_description' 
    | 'ignore';

export interface IColumnTypeMapping {
  columnIndex: number;
  dataType: DataType;
}

export interface IParsingProfile {
  dataLine: number;
  columnTypeMappings: IColumnTypeMapping[];
}
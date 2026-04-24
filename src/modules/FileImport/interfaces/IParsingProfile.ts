export interface IColumnTypeMapping {
  columnIndex: number;
  dataType: string;
}

export interface IParsingProfile {
  dataLine: number;
  columnTypeMappings: IColumnTypeMapping[];
}
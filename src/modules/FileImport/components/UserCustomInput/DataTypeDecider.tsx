import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { DataType } from '../../interfaces/IParsingProfile';

interface DataTypeDeciderProps {
  colName: string;
  value: DataType;
  onTypeSelected: (dataType: DataType, index: number) => void;
  identifier: number;
}

export const DataTypeDecider: React.FC<DataTypeDeciderProps> = ({ colName, value, onTypeSelected, identifier }) => {
  const handleChange = (
    event:
      | React.ChangeEvent<
          Omit<HTMLInputElement, 'value'> & {
            value: string;
          },
          Element
      >
      | (Event & {
        target: {
          value: string;
          name: string;
        };
      }),
  ) => {
    onTypeSelected((event.target.value || 'ignore') as DataType, identifier);
  };
  return (
    <FormControl fullWidth size="small" key={`form-control-${identifier}`}>
      <InputLabel id={`col-selector-data-type-label-${identifier}`} key={`label-${identifier}`}>{colName}</InputLabel>
      <Select
        labelId={`col-selector-data-type-label-${identifier}`}
        id={`col-selector-data-type-${identifier}`}
        key={`select${identifier}`}
        value={value}
        label={colName}
        onChange={handleChange}
      >
        <MenuItem value="ignore" defaultChecked>
          <em>Ignore</em>
        </MenuItem>
        <MenuItem value="date_mmddyyyy">Date (MM/DD/YYYY)</MenuItem>
        <MenuItem value="date_ddmmyyyy">Date (DD/MM/YYYY)</MenuItem>
        <MenuItem value="date_yyyymmdd">Date (YYYY-MM-DD)</MenuItem>
        <MenuItem value="description">Description</MenuItem>
        <MenuItem value="amount">
          Amount (Single value for Credit and Debit)
        </MenuItem>
        <MenuItem value="credit_only">Credit Only</MenuItem>
        <MenuItem value="debit_only">Debit Only</MenuItem>
        <MenuItem value="closing_balance">Closing Balance</MenuItem>
      </Select>
    </FormControl>
  );
};

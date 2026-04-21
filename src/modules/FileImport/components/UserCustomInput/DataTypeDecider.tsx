import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

interface DataTypeDeciderProps {
  colName: string;
  onTypeSelected: (colName: string, dataType: string) => void;
  identifier: string | number;
}

export const DataTypeDecider: React.FC<DataTypeDeciderProps> = ({ colName, onTypeSelected, identifier }) => {
  const [dataType, setDataType] = useState('');
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
    setDataType(event.target.value);
    onTypeSelected(colName, event.target.value);
  };
  return (
    <FormControl fullWidth size="small" key={`form-control-${identifier}`}>
      <InputLabel id={`col-selector-data-type-label-${identifier}`} key={`label-${identifier}`}>{colName}</InputLabel>
      <Select
        labelId={`col-selector-data-type-label-${identifier}`}
        id={`col-selector-data-type-${identifier}`}
        key={`select${identifier}`}
        value={dataType}
        label={colName}
        onChange={handleChange}
      >
        <MenuItem value="">
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
        <MenuItem value="closing_balance_description">
          Closing Balance Description
        </MenuItem>
      </Select>
    </FormControl>
  );
};

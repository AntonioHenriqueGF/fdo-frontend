import { useAtom } from 'jotai';
import { NumberField } from '../../../../shared/components/NumberField';
import { csvImportAddSpreadAtom, dataStartLineSelectedSpreadAtom, fileImportHashAtom, fileImportNameAtom, headerLineSelectedSpreadAtom } from '../../atoms/importAtoms';
import { UserCustomInputWrapper } from './styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTypeDecider } from './DataTypeDecider';
import { estimateHeaders, estimateDataStartLine } from './Props';
import type { DataType } from '../../interfaces/IParsingProfile';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { normalizeData, validateProfile } from '../../utils/dataNormalization';
import { useSnackbar } from 'notistack';
import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import type { AxiosError } from 'axios';

export const UserCustomInput: React.FC = () => {
  const [headerLineSelected, setHeaderLineSelected] = useAtom(headerLineSelectedSpreadAtom);
  const [dataStartLineSelected, setDataStartLineSelected] = useAtom(dataStartLineSelectedSpreadAtom);
  const [dataTypePicked, setDataTypePicked] = useState<Record<DataType, number>>({} as Record<DataType, number>);
  const [fileName] = useAtom(fileImportNameAtom);
  const [fileHash] = useAtom(fileImportHashAtom);

  const [submitting, setSubmitting] = useState(false);
    
  const [csvImport] = useAtom(csvImportAddSpreadAtom);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const estimatedHeader = estimateHeaders(csvImport?.data ?? []);
    setHeaderLineSelected(estimatedHeader);
    setDataStartLineSelected(estimateDataStartLine(csvImport?.data ?? [], estimatedHeader));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvImport]);

  const handleTypeSelected = useCallback((dataType: DataType, index: number) => {
    setDataTypePicked((prev) => ({ ...prev, [dataType as DataType]: index }));
  }, [setDataTypePicked]);

  const handleSubmit = useCallback(() => {
    // Here you would typically validate the dataTypePicked to ensure all required types are selected
    // and then proceed to normalize the data using the selected header line, data start line, and column type mappings.
    try {
      const columnMapping = Object.entries(dataTypePicked).map(([dataType, columnIndex]) => ({
        dataType: dataType as DataType,
        columnIndex,
      }));
      if (!csvImport?.data) {
        throw new Error('No CSV data available for processing.');
      }

      if (!validateProfile({
        dataLine: dataStartLineSelected,
        columnTypeMappings: columnMapping,
      })) {
        return;
      }
      console.log({
        normalized: normalizeData(csvImport?.data, {
          dataLine: dataStartLineSelected,
          columnTypeMappings: columnMapping,
        }),
        fileName,
        fileHash,
      });

      setSubmitting(true);
      ApiRequest({
        method: 'POST',
        url: '/api/import',
        data: {
          normalized: normalizeData(csvImport?.data, {
            dataLine: dataStartLineSelected,
            columnTypeMappings: columnMapping,
          }),
          fileName,
          fileHash,
        },
        callback: () => {          
          enqueueSnackbar('File imported successfully', { variant: 'success' });
        },
        errorCallback: (error: AxiosError<StandardApiResponse<any>>) => {
          enqueueSnackbar(error.response?.data.message ?? 'File import failed. Please try again.', { variant: 'error' });
        },
        finallyCallback: () => {
          setSubmitting(false);
        },
      });
    } catch(error) {
      enqueueSnackbar((error as Error).message || 'Error validation fields', { variant: 'error' });
    }
  }, [dataTypePicked, dataStartLineSelected, fileName, fileHash, csvImport?.data, enqueueSnackbar]);

  const headerRow = useMemo(() => {
    if (!csvImport || csvImport.data.length === 0) {
      return [];
    }
    return csvImport.data[headerLineSelected - 1].filter((cell) => cell !== undefined && cell !== null && cell !== '') || [];
  }, [csvImport, headerLineSelected]);


  const dataDecider = useMemo(() => {
    return (
      <div className="data-type-decider">
        {headerRow.map((colName, index) => (
          <DataTypeDecider 
            key={`${index}-${colName}`} 
            identifier={index} 
            colName={colName} 
            onTypeSelected={handleTypeSelected} 
          />
        ))}
      </div>
    );
  }, [headerRow, handleTypeSelected]);

  return csvImport ? (<UserCustomInputWrapper>
    <NumberField min={1} max={30} size="small" label="Header start line" value={headerLineSelected} onValueChange={(value) => setHeaderLineSelected(value ?? 1)} />
    <NumberField min={1} max={30} size="small" label="Data start line" value={dataStartLineSelected} onValueChange={(value) => setDataStartLineSelected(value ?? 1)} />
    <div className="info-text">* Line numbers are 1-based, meaning the first line is considered line 1.</div>
    {dataDecider}
    <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit} disabled={submitting} loading={submitting}>
      Submit
    </Button>
  </UserCustomInputWrapper>) : null;
};
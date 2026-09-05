import { useAtom, useSetAtom } from 'jotai';
import { NumberField } from '../../../../shared/components/NumberField';
import {
  csvImportAddSpreadAtom,
  deleteFileImportAtom,
  fileImportHashAtom,
  fileImportNameAtom,
  headerLineSelectedSpreadAtom,
} from '../../atoms/importAtoms';
import { UserCustomInputWrapper } from './styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTypeDecider } from './DataTypeDecider';
import { estimateHeaders } from './Props';
import type { DataType } from '../../interfaces/IParsingProfile';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { normalizeData, validateProfile } from '../../utils/dataNormalization';
import { useSnackbar } from 'notistack';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../../Services/ApiRequest';
import type { AxiosError } from 'axios';

const DATA_TYPE_PICKED_STORAGE_KEY = 'fileImport.dataTypePicked';

export const UserCustomInput: React.FC = () => {
  const [headerLineSelected, setHeaderLineSelected] = useAtom(
    headerLineSelectedSpreadAtom,
  );
  const [dataTypePicked, setDataTypePicked] = useState<DataType[]>(() => {
    try {
      const stored = localStorage.getItem(DATA_TYPE_PICKED_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as DataType[]) : [];
    } catch {
      return [];
    }
  });
  const [fileName] = useAtom(fileImportNameAtom);
  const [fileHash] = useAtom(fileImportHashAtom);

  const [submitting, setSubmitting] = useState(false);

  const [csvImport] = useAtom(csvImportAddSpreadAtom);
  const deleteFileImport = useSetAtom(deleteFileImportAtom);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const estimatedHeader = estimateHeaders(csvImport?.data ?? []);
    setHeaderLineSelected(estimatedHeader);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvImport]);

  const handleTypeSelected = useCallback(
    (dataType: DataType, index: number) => {
      setDataTypePicked((prev) => {
        const updatedDataTypePicked = [...prev];
        updatedDataTypePicked[index] = dataType;
        return updatedDataTypePicked;
      });
    },
    [setDataTypePicked],
  );

  const handleSubmit = useCallback(() => {
    // Here you would typically validate the dataTypePicked to ensure all required types are selected
    // and then proceed to normalize the data using the selected header line, data start line, and column type mappings.
    try {
      if (!csvImport?.data) {
        throw new Error('No CSV data available for processing.');
      }

      if (
        !validateProfile({
          dataLine: headerLineSelected + 1,
          columnTypeMappings: dataTypePicked,
        })
      ) {
        return;
      }

      localStorage.setItem(
        DATA_TYPE_PICKED_STORAGE_KEY,
        JSON.stringify(dataTypePicked),
      );

      setSubmitting(true);
      ApiRequest({
        method: 'POST',
        url: '/api/import',
        data: {
          normalized: normalizeData(csvImport?.data, {
            dataLine: headerLineSelected + 1,
            columnTypeMappings: dataTypePicked,
          }),
          fileName,
          fileHash,
        },
        callback: () => {
          enqueueSnackbar('File import job started', { variant: 'info' });
          deleteFileImport();
        },
        errorCallback: (error: AxiosError<StandardApiResponse<any>>) => {
          enqueueSnackbar(
            error.response?.data.message ??
              'File import failed. Please try again.',
            { variant: 'error' },
          );
        },
        finallyCallback: () => {
          setSubmitting(false);
        },
      });
    } catch (error) {
      enqueueSnackbar((error as Error).message || 'Error validation fields', {
        variant: 'error',
      });
    }
  }, [
    dataTypePicked,
    headerLineSelected,
    fileName,
    fileHash,
    csvImport?.data,
    enqueueSnackbar,
    deleteFileImport,
  ]);

  const headerRow = useMemo(() => {
    if (!csvImport || csvImport.data.length === 0) {
      return [];
    }
    return (
      csvImport.data[headerLineSelected - 1].filter(
        (cell) => cell !== undefined && cell !== null && cell !== '',
      ) || []
    );
  }, [csvImport, headerLineSelected]);

  const dataDecider = useMemo(() => {
    return (
      <div className="data-type-decider">
        {headerRow.map((colName, index) => (
          <DataTypeDecider
            key={`${index}-${colName}`}
            value={dataTypePicked[index] || ''}
            identifier={index}
            colName={colName}
            onTypeSelected={handleTypeSelected}
          />
        ))}
      </div>
    );
  }, [headerRow, dataTypePicked, handleTypeSelected]);

  return csvImport ? (
    <UserCustomInputWrapper>
      <div className="double-input">
        <NumberField
          min={1}
          max={30}
          size="small"
          label="Header line"
          value={headerLineSelected}
          onValueChange={(value) => setHeaderLineSelected(value ?? 1)}
        />
        {/* <NumberField
          min={1}
          max={30}
          size="small"
          label="Data start line"
          value={dataStartLineSelected}
          onValueChange={(value) => setDataStartLineSelected(value ?? 1)}
        /> */}
      </div>
      <div className="info-text">
        * Line numbers are 1-based, meaning the first line is considered line 1.
      </div>
      {dataDecider}
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={submitting}
        loading={submitting}
      >
        Submit
      </Button>
    </UserCustomInputWrapper>
  ) : null;
};

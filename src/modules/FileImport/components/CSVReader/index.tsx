import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, type CSSProperties } from 'react';

import { useCSVReader } from 'react-papaparse';
import {
  csvImportAddSpreadAtom,
  fileImportHashAtom,
  fileImportNameAtom,
} from '../../atoms/importAtoms';
import type { RawImport } from '../../interfaces/RawImport';
import { CSVReaderWrapper } from './styles';

import { useSnackbar } from 'notistack';
import { generateHashFromFile } from './Props';
import { Button } from '@mui/material';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    justifyItems: 'center',
    marginBottom: 10,
    fontFamily: 'var(--standard-font-family)',
  } as CSSProperties,
  browseFile: {
    width: '224px',
    fontFamily: 'var(--standard-font-family)',
    backgroundColor: 'var(--action-button-color)',
  } as CSSProperties,
  acceptedFile: {
    lineHeight: 2.5,
    paddingLeft: 10,
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--standard-font-family)',
  } as CSSProperties,
  remove: {
    padding: '0 20px',
    fontFamily: 'var(--standard-font-family)',
  } as CSSProperties,
  progressBar: {
    backgroundColor: 'red',
    height: '5px',
    position: 'absolute',
  } as CSSProperties,
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const { enqueueSnackbar } = useSnackbar();

  const [, setCsvImport] = useAtom(csvImportAddSpreadAtom);

  const handleUploadAccepted = useAtomCallback(
    useCallback(
      (_get, set, results: RawImport, file: File) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
          alert('Please upload a valid CSV file.');
          return;
        }
        set(fileImportNameAtom, file.name);

        generateHashFromFile(file)
          .then((hash) => {
            set(fileImportHashAtom, hash);
          })
          .catch((err) => {
            enqueueSnackbar('Error generating file hash', { variant: 'error' });
            console.error('Error generating file hash:', err);
          });

        setCsvImport(results);
      },
      [setCsvImport, enqueueSnackbar],
    ),
  );

  // Handle the removal here
  const handleRemoveFile = useCallback(() => {
    setCsvImport(null);
  }, [setCsvImport]);
  return (
    <CSVReaderWrapper>
      <CSVReader
        onUploadAccepted={handleUploadAccepted}
        accept=".csv, text/csv"
      >
        {(props: any) => (
          <>
            <div style={styles.csvReader}>
              <Button
                variant="contained"
                size="medium"
                type="button"
                {...props.getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </Button>
              <div style={styles.acceptedFile}>{props.acceptedFile?.name}</div>
              {props.acceptedFile?.name && (
                <Button
                  variant="contained"
                  size="medium"
                  type="button"
                  color="error"
                  {...props.getRemoveFileProps()}
                  style={styles.remove}
                  onClick={(event: Event) => {
                    handleRemoveFile();
                    const removeProps = props.getRemoveFileProps();
                    if (removeProps?.onClick) {
                      removeProps.onClick(event);
                    }
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </>
        )}
      </CSVReader>
    </CSVReaderWrapper>
  );
}

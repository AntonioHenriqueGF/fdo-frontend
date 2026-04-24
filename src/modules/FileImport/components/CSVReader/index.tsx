import { useAtom } from 'jotai';
import { useCallback, type CSSProperties } from 'react';

import { useCSVReader } from 'react-papaparse';
import { csvImportAddSpreadAtom } from '../../atoms/importAtoms';
import type { RawImport } from '../../interfaces/RawImport';
import { CSVReaderWrapper } from './styles';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: '20%',
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();

  const [, setCsvImport] = useAtom(csvImportAddSpreadAtom);

  const handleUploadAccepted = useCallback((results: RawImport, file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a valid CSV file.');
      return;
    }
    setCsvImport(results);
  }, [setCsvImport]);

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
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div style={styles.csvReader}>
              <button type='button' {...getRootProps()} style={styles.browseFile}>
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile?.name}
              </div>
              <button {...getRemoveFileProps()} style={styles.remove} onClick={(event: Event) => {
                handleRemoveFile();
                const removeProps = getRemoveFileProps();
                if (removeProps?.onClick) {
                  removeProps.onClick(event);
                }
              }}>
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
    </CSVReaderWrapper>
  );
}
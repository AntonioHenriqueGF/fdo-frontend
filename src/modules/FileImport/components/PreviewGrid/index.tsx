import { useAtom } from 'jotai';
import {
  csvImportAddSpreadAtom,
  headerLineSelectedSpreadAtom,
} from '../../atoms/importAtoms';
import { numericToAlfabeticColumnIndex } from './Props';
import { useCallback, useMemo } from 'react';
import { GridContainer, GridWrapper } from './styles';

export const PreviewGrid: React.FC = () => {
  const [csvImport] = useAtom(csvImportAddSpreadAtom);
  const [headerLineSelected] = useAtom(headerLineSelectedSpreadAtom);

  const headers = useMemo(() => {
    if (!csvImport || csvImport.data.length === 0) {
      return <></>;
    }
    return (
      <tr>
        <th key="index" className="index-header">
          #
        </th>
        {csvImport?.data[0].map((_, cellIndex) => (
          <th key={`header_${cellIndex}`}>
            {numericToAlfabeticColumnIndex(cellIndex)}
          </th>
        ))}
      </tr>
    );
  }, [csvImport]);

  const headerDataRowDecider = useCallback(
    (rowIndex: number) => {
      if (rowIndex === headerLineSelected - 1) {
        return 'header-row';
      }
      return '';
    },
    [headerLineSelected],
  );

  const firstRowsPreview = useMemo(() => {
    if (!csvImport || csvImport.data.length === 0) {
      return <></>;
    }

    return csvImport?.data.slice(0, 30).map((row, rowIndex) => (
      <tr key={rowIndex} className={headerDataRowDecider(rowIndex)}>
        <td key={`index_${rowIndex}`}>{rowIndex + 1}</td>
        {row.map((cell, cellIndex) => (
          <td
            key={cellIndex}
            id={`previewgrid_${numericToAlfabeticColumnIndex(cellIndex)}${rowIndex + 1}`}
          >
            {cell}
          </td>
        ))}
      </tr>
    ));
  }, [csvImport, headerDataRowDecider]);

  return (
    <GridContainer>
      <GridWrapper>
        <thead>{headers}</thead>
        <tbody>{firstRowsPreview}</tbody>
      </GridWrapper>
    </GridContainer>
  );
};

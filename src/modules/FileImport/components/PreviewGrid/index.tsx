import { useAtom } from "jotai";
import {
  csvImportAddSpreadAtom,
  dataStartLineSelectedSpreadAtom,
  headerLineSelectedSpreadAtom,
} from "../../atoms/importAtoms";
import { numericToAlfabeticColumnIndex } from "./Props";
import { useCallback, useMemo } from "react";
import { GridWrapper } from "./styles";

export const PreviewGrid: React.FC = () => {
  const [csvImport] = useAtom(csvImportAddSpreadAtom);
  const [headerLineSelected] = useAtom(headerLineSelectedSpreadAtom);
  const [dataStartLineSelected] = useAtom(dataStartLineSelectedSpreadAtom);

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

  const headerDataRowDecider = useCallback((rowIndex: number) => {
    if (rowIndex === headerLineSelected - 1) {
      return "header-row";
    } else if (rowIndex === dataStartLineSelected - 1) {
      return "data-row";
    }
    return "";
  }, [headerLineSelected, dataStartLineSelected]);

  const firstRowsPreview = useMemo(() => {
    if (!csvImport || csvImport.data.length === 0) {
      return <></>;
    }

    return csvImport?.data.slice(0, 30).map((row, rowIndex) => (
      <tr key={rowIndex}
        className={headerDataRowDecider(rowIndex)}>
        <td
          key={`index_${rowIndex}`}
        >
          {rowIndex + 1}
        </td>
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

  // Renderiza uma tabela com os dados do csvImport.data (string[][])
  return (
    <GridWrapper>
      <thead>{headers}</thead>
      <tbody>{firstRowsPreview}</tbody>
    </GridWrapper>
  );
};

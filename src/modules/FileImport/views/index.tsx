import { useEffect } from 'react';
import CSVReader from '../components/CSVReader';
import { PreviewGrid } from '../components/PreviewGrid';
import { UserCustomInput } from '../components/UserCustomInput';
import { ImportPanelSelectionWrapper } from './styles';
import { deleteFileImportAtom, fileImportHashAtom } from '../atoms/importAtoms';
import { useAtom } from 'jotai';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ImportList } from '../components/ImportList';

export const FileImportView: React.FC = () => {
  const [, deleteFileImport] = useAtom(deleteFileImportAtom);
  const [fileImportHash] = useAtom(fileImportHashAtom);
  useEffect(() => {
    return () => {
      deleteFileImport();
    };
  }, [deleteFileImport]);

  return (
    <ContentPad>
      <h2>File Import</h2>
      <CSVReader />
      {fileImportHash ? (
        <ImportPanelSelectionWrapper>
          <UserCustomInput />
          <PreviewGrid />
        </ImportPanelSelectionWrapper>
      ) : (
        <ImportList />
      )}
    </ContentPad>
  );
};

import { useEffect } from 'react';
import CSVReader from '../components/CSVReader';
import { PreviewGrid } from '../components/PreviewGrid';
import { UserCustomInput } from '../components/UserCustomInput';
import { ImportPanelSelectionWrapper } from './styles';
import { deleteFileImportAtom } from '../atoms/importAtoms';
import { useAtom } from 'jotai';
import { ContentPad } from '../../../shared/components/ContentPad';

export const FileImportView: React.FC = () => {
  const [, deleteFileImport] = useAtom(deleteFileImportAtom);
  useEffect(() => {
    return () => {
      deleteFileImport();
    };
  }, [deleteFileImport]);

  return (
    <ContentPad>
      <h2>File Import</h2>
      <CSVReader />
      <ImportPanelSelectionWrapper>
        <UserCustomInput />
        <PreviewGrid />
      </ImportPanelSelectionWrapper>
    </ContentPad>
  );
};
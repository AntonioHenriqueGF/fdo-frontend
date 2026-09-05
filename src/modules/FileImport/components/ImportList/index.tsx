import { useEffect, useState } from 'react';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../../Services/ApiRequest';
import type { IImport } from '../../interfaces/IImport';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImportListWrapper } from './styles';
import { IconButton } from '../../../../shared/components/IconButton';
import { useAtomValue } from 'jotai';
import { fileImportHashAtom } from '../../atoms/importAtoms';
import SyncIcon from '@mui/icons-material/Sync';
import { Alert } from '@mui/material';
import { Loading } from '../../../../shared/components/Loading';

export const ImportList: React.FC = () => {
  const [imports, setImports] = useState<IImport[]>([]);
  const [loading, setLoading] = useState(false);
  const fileImportHash = useAtomValue(fileImportHashAtom);
  useEffect(() => {
    if (fileImportHash) return;
    setLoading(true);
    ApiRequest<StandardApiResponse<IImport[]>>({
      url: '/api/import',
      method: 'GET',
      callback: (response) => {
        console.log('ImportList response:', response);
        setImports(response.data.data);
      },
      finallyCallback: () => setLoading(false),
    });
  }, [fileImportHash]);

  return (
    <ImportListWrapper>
      <div className="import-list-header">
        <h3>Import List</h3>
        <IconButton // Refresh Import List
          variant="contained"
          color="primary"
          tooltipTitle="Refresh Import List"
          onClick={() => {
            setImports([]); // Clear the current import list before fetching new data
            setLoading(true);
            ApiRequest<StandardApiResponse<IImport[]>>({
              url: '/api/import',
              method: 'GET',
              callback: (response) => {
                console.log('ImportList response:', response);
                setImports(response.data.data);
              },
              finallyCallback: () => setLoading(false),
            });
          }}
        >
          <SyncIcon />
        </IconButton>
      </div>
      <p>List of imports will be displayed here.</p>
      <ul>
        {imports.length > 0 &&
          imports.map((imp) => (
            <li key={imp.imp_id}>
              <div className="import-item">
                <p>
                  {imp.imp_file_name} - {imp.imp_imported_at}
                </p>
                <IconButton
                  variant="contained"
                  color="error"
                  style={{ marginLeft: 'auto' }}
                  tooltipTitle="Delete Import"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this import?',
                      )
                    ) {
                      ApiRequest<StandardApiResponse>({
                        url: `/api/import/${imp.imp_id}`,
                        method: 'DELETE',
                        callback: () => {
                          setImports((prevImports) =>
                            prevImports.filter((i) => i.imp_id !== imp.imp_id),
                          );
                        },
                      });
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </li>
          ))}
        {imports.length === 0 && !loading && (
          <Alert severity="info">No transactions found.</Alert>
        )}
        {loading && <Loading />}
      </ul>
    </ImportListWrapper>
  );
};

import { useEffect, useState } from 'react';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../../Services/ApiRequest';
import type { IImport } from '../../interfaces/IImport';
import { Button } from '@mui/material';
import { ImportListWrapper } from './styles';

export const ImportList: React.FC = () => {
  const [imports, setImports] = useState<IImport[]>([]);
  useEffect(() => {
    ApiRequest<StandardApiResponse<IImport[]>>({
      url: '/api/import',
      method: 'GET',
      callback: (response) => {
        console.log('ImportList response:', response);
        setImports(response.data.data);
      },
    });
  }, []);

  return (
    <ImportListWrapper>
      <h3>Import List</h3>
      <p>List of imports will be displayed here.</p>
      <ul>
        {imports.map((imp) => (
          <li key={imp.imp_id}>
            <div className="import-item">
              <p>
                {imp.imp_file_name} - {imp.imp_imported_at}
              </p>
              <Button
                variant="contained"
                color="error"
                style={{ marginLeft: 'auto' }}
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
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ImportListWrapper>
  );
};

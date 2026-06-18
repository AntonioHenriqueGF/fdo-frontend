import React, { useCallback, useEffect, useState } from 'react';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import { useSnackbar } from 'notistack';
import type { AxiosError } from 'axios';
import { Button, TextField } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { ContentWrapper } from './styles';
import { Loading } from '../../../shared/components/Loading';
import type { Category, CategoryList } from '../models/Categories';
import { CategoriesList } from '../components/CategoriesList';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryList[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRules, setLoadingRules] = useState<Record<number, boolean>>({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const abort = new AbortController();
    // Fetch categories from the backend when the component mounts
    setLoadingCategories(true);
    ApiRequest<StandardApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
      signal: abort.signal,
      callback: (response) => {
        setCategories(response.data.data);
      },
      errorCallback: () => {
        if (abort.signal.aborted) return; // Don't show error if the request was aborted
        enqueueSnackbar('Error loading categories', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoadingCategories(false);
      },
    });
    return () => {
      abort.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCategory = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryName = formData.get('categoryName') as string;
    // Send request to create a new category
    ApiRequest<StandardApiResponse<Category>>({
      url: '/api/categories',
      method: 'POST',
      data: { description: categoryName },
      callback: (response) => {
        setCategories((prev) => [...prev, response.data.data]);
        (e.target as HTMLFormElement).reset(); // Reset the form after successful submission
      },
      errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
        const errorMessage = error.response?.data.data ?? 'Error creating category';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      },
    });
  }, [enqueueSnackbar, setCategories]);

  return (
    <ContentPad>
      <ContentWrapper>
        <h2>Categories</h2>
        {/* Form for creating categories */}
        <form onSubmit={handleCreateCategory}>
          <TextField type="text" name="categoryName" placeholder="Category Name" size="small" variant="standard" required />
          <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} size='small'>Add Category</Button>
        </form>
        {/* List of categories with options to edit and delete */}
        {loadingCategories ? (
          <Loading style={{ height: '100%' }} />
        ) : (
          <CategoriesList
            categories={categories}
            loadingRules={loadingRules}
            setCategories={setCategories}
            setLoadingRules={setLoadingRules}
          />
        )}
      </ContentWrapper>
    </ContentPad>
  );
};
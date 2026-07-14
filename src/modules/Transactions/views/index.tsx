import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import { Skeleton } from '@mui/material';
import type { Transaction, TransactionResponse } from '../models/TransactionResponse';
import type { Category } from '../../Categories/models/Categories';

export const TransactionsView: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categories, setCategories] = useState<{ cat_id: number; cat_description: string }[]>([]);
  
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

  useEffect(() => {
    const abort = new AbortController();

    ApiRequest<StandardApiResponse<TransactionResponse>>({
      url: '/api/transactions',
      method: 'GET',
      callback: (response) => {
        console.log('Transactions fetched:', response.data.data);
        setTransactions(response.data.data.rows);
      },
      errorCallback: () => {
        if (abort.signal.aborted) return; // Don't show error if the request was aborted
        enqueueSnackbar('Error loading transactions', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoading(false);
      },
    });

    return () => {
      abort.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscarFiltro = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get('category_id') as string;
    const date_start = formData.get('date_start') as string;
    const date_end = formData.get('date_end') as string;

    setLoading(true);
    ApiRequest<StandardApiResponse<TransactionResponse>>({
      url: '/api/transactions',
      method: 'GET',
      data: {
        category_id: categoryId,
        date_start,
        date_end,
      },
      callback: (response) => {
        console.log('Transactions fetched with filter:', response.data.data);
        setTransactions(response.data.data.rows);
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error loading transactions with filter', { variant: 'error' });
      },
      finallyCallback: () => {
        setLoading(false);
      },
    });
  };
  

  return (<ContentPad>
    <h2>Transactions</h2>
    <form action="get" onSubmit={handleBuscarFiltro}>
      <label htmlFor="category_id">Category</label>
      <select name="category_id" id="category_id" disabled={loadingCategories}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.cat_id} value={category.cat_id}>
            {category.cat_description}
          </option>
        ))}
      </select>
      <label htmlFor="date_start">Start Date:</label>
      <input type="date" id="date_start" name="date_start" />
      <label htmlFor="date_end">End Date:</label>
      <input type="date" id="date_end" name="date_end" />
      <button type="submit">Search</button>
    </form>
    <form action="get" onSubmit={handleBuscarFiltro}>
      <h3>Add Transaction</h3>
      <label htmlFor="tra_description">Description:</label>
      <input type="text" id="tra_description" name="tra_description" required />
      <label htmlFor="tra_amount">Amount:</label>
      <input type="number" id="tra_amount" name="tra_amount" step="0.01" required />
      <label htmlFor="tra_date">Date:</label>
      <input type="date" id="tra_date" name="tra_date" required />
    </form>
    {
      loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
        </div>
      ) : (
        <div>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.tra_id}>
                  <strong>Name:</strong> {transaction.tra_description}, 
                  <strong>Category:</strong> {transaction.cat_description}, 
                  <strong>Amount:</strong> {transaction.tra_amount}, 
                  <strong>Date:</strong> {new Date(transaction.tra_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }
  </ContentPad>);
};
import React, { useCallback, useState } from 'react';
import { CategoryListStyles } from '../views/styles';
import {
  Button,
  IconButton as MuiIconButton,
  TextField,
  Tooltip,
} from '@mui/material';

import LabelIcon from '@mui/icons-material/Label';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RuleIcon from '@mui/icons-material/Rule';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../Services/ApiRequest';
import type { Category, CategoryList } from '../models/Categories';
import type { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import type { Rule } from '../models/Rules';
import { Loading } from '../../../shared/components/Loading';
import { RulesList } from './RulesList';
import { IconButton } from '../../../shared/components/IconButton';

interface CategoriesListProps {
  categories: CategoryList[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryList[]>>;
  loadingRules: Record<number, boolean>;
  setLoadingRules: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  setCategories,
  loadingRules,
  setLoadingRules,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [deletingCategoryId, setDeletingCategoryId] = useState<
    Record<number, boolean>
  >({});
  const [savingEditCategoryId, setSavingEditCategoryId] = useState<
    Record<number, boolean>
  >({});
  const [savingNewRuleCategoryId, setSavingNewRuleCategoryId] = useState<
    Record<number, boolean>
  >({});
  const [loadingToggleIncome, setLoadingToggleIncome] = useState<
    Record<number, boolean>
  >({});

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      // Send request to delete the category
      setDeletingCategoryId((prev) => ({ ...prev, [categoryId]: true }));
      return ApiRequest({
        url: `/api/categories/${categoryId}`,
        method: 'DELETE',
        callback: () => {
          setCategories((prev) =>
            prev.filter((cat) => cat.cat_id !== categoryId),
          );
        },
        errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
          const errorMessage =
            error.response?.data.data ?? 'Error deleting category';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        },
        finallyCallback: () => {
          setDeletingCategoryId((prev) => ({ ...prev, [categoryId]: false }));
        },
      });
    },
    [enqueueSnackbar, setCategories, setDeletingCategoryId],
  );

  const handleOnSubmitEdit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>, categoryId: number) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newDescription = formData.get('categoryDescription') as string;

      // Send request to update the category
      setSavingEditCategoryId((prev) => ({ ...prev, [categoryId]: true }));
      ApiRequest<StandardApiResponse<Category>>({
        url: `/api/categories/${categoryId}`,
        method: 'PUT',
        data: { description: newDescription },
        callback: (response) => {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.cat_id === categoryId ? response.data.data : cat,
            ),
          );
          e.target.reset(); // Reset the form after successful submission
        },
        errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
          const errorMessage =
            error.response?.data.data ?? 'Error updating category';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        },
        finallyCallback: () => {
          setSavingEditCategoryId((prev) => ({ ...prev, [categoryId]: false }));
        },
      });
    },
    [enqueueSnackbar, setCategories, setSavingEditCategoryId],
  );

  const toggleEditMode = useCallback(
    (categoryId: number) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cat_id === categoryId
            ? { ...cat, isEditing: !cat.isEditing, showRules: false }
            : cat,
        ),
      );
    },
    [setCategories],
  );

  const toggleRulesMode = useCallback(
    (category: CategoryList) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cat_id === category.cat_id
            ? { ...cat, showRules: !cat.showRules, isEditing: false }
            : cat,
        ),
      );
      if (category.rules === undefined) {
        // Fetch rules for the category if not already loaded
        setLoadingRules((prev) => ({ ...prev, [category.cat_id]: true }));
        ApiRequest<StandardApiResponse<Rule[]>>({
          url: `/api/categories/${category.cat_id}/rules`,
          method: 'GET',
          callback: (response) => {
            setCategories((prev) =>
              prev.map((cat) =>
                cat.cat_id === category.cat_id
                  ? { ...cat, rules: response.data.data }
                  : cat,
              ),
            );
          },
          errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
            const errorMessage =
              error.response?.data.data ?? 'Error loading rules';
            enqueueSnackbar(errorMessage, { variant: 'error' });
          },
          finallyCallback: () => {
            setLoadingRules((prev) => ({ ...prev, [category.cat_id]: false }));
          },
        });
      }
    },
    [enqueueSnackbar, setCategories, setLoadingRules],
  );

  const handleOnSubmitNewRule = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>, categoryId: number) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const rulePattern = formData.get('rulePattern') as string;
      const rulePriority = parseInt(formData.get('rulePriority') as string);
      // Send request to create a new rule for the category
      setSavingNewRuleCategoryId((prev) => ({ ...prev, [categoryId]: true }));
      ApiRequest<StandardApiResponse<Rule>>({
        url: `/api/categories/${categoryId}/rules`,
        method: 'POST',
        data: { pattern: rulePattern, priority: rulePriority },
        callback: (response) => {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.cat_id === categoryId
                ? { ...cat, rules: [...(cat.rules ?? []), response.data.data] }
                : cat,
            ),
          );
          e.target.reset(); // Reset the form after successful submission
        },
        errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
          const errorMessage =
            error.response?.data.data ?? 'Error creating rule';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        },
        finallyCallback: () => {
          setSavingNewRuleCategoryId((prev) => ({
            ...prev,
            [categoryId]: false,
          }));
        },
      });
    },
    [enqueueSnackbar, setCategories],
  );

  const toggleIncomeStatus = useCallback(
    (categoryId: number, currentStatus: boolean) => {
      setLoadingToggleIncome((prev) => ({ ...prev, [categoryId]: true }));
      ApiRequest<StandardApiResponse<Category>>({
        url: `/api/categories/${categoryId}/income`,
        method: 'PATCH',
        data: { cat_is_income: !currentStatus },
        callback: (response) => {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.cat_id === categoryId ? response.data.data : cat,
            ),
          );
        },
        errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
          const errorMessage =
            error.response?.data.data ??
            'Error updating category income status';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        },
        finallyCallback: () => {
          setLoadingToggleIncome((prev) => ({ ...prev, [categoryId]: false }));
        },
      });
    },
    [enqueueSnackbar, setCategories],
  );
  return (
    <CategoryListStyles>
      {categories.length ? (
        categories.map((category) => {
          const isEditing = category.isEditing ?? false;
          const showRules = category.showRules ?? false;
          const deleting = deletingCategoryId[category.cat_id] ?? false;
          const savingEdit = savingEditCategoryId[category.cat_id] ?? false;
          const savingNewRule =
            savingNewRuleCategoryId[category.cat_id] ?? false;
          return (
            <React.Fragment key={category.cat_id}>
              <li className="category-item">
                <div className="category-description item-description">
                  <LabelIcon />{' '}
                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleOnSubmitEdit(e, category.cat_id)}
                      className="edit-category-form"
                    >
                      <TextField
                        type="text"
                        name="categoryDescription"
                        defaultValue={category.cat_description}
                        placeholder="Description"
                        size="small"
                        variant="standard"
                        required
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SaveIcon />}
                        loading={savingEdit}
                      >
                        Save
                      </Button>
                    </form>
                  ) : (
                    category.cat_description
                  )}
                </div>
                <div className="category-item-buttons item-buttons">
                  <Tooltip
                    title={
                      category.cat_is_income
                        ? 'Mark as Expense'
                        : 'Mark as Income'
                    }
                    placement="top"
                    arrow
                  >
                    <MuiIconButton
                      color={category.cat_is_income ? 'warning' : 'inherit'}
                      size="small"
                      onClick={() =>
                        toggleIncomeStatus(
                          category.cat_id,
                          !!category.cat_is_income,
                        )
                      }
                      loading={loadingToggleIncome[category.cat_id] ?? false}
                    >
                      <MonetizationOnIcon />
                    </MuiIconButton>
                  </Tooltip>
                  <IconButton
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => toggleRulesMode(category)}
                    tooltipTitle={showRules ? 'Close Rules' : 'Show Rules'}
                  >
                    {showRules ? <CloseIcon /> : <RuleIcon />}
                  </IconButton>
                  <IconButton
                    color="warning"
                    variant="contained"
                    size="small"
                    onClick={() => toggleEditMode(category.cat_id)}
                    tooltipTitle={isEditing ? 'Close Edit' : 'Edit Category'}
                  >
                    {isEditing ? <CloseIcon /> : <EditIcon />}
                  </IconButton>
                  <IconButton
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => handleDeleteCategory(category.cat_id)}
                    loading={deleting}
                    tooltipTitle="Delete Category"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </li>
              {showRules && (
                <div className="rules-section">
                  <form
                    onSubmit={(e) => handleOnSubmitNewRule(e, category.cat_id)}
                    className="add-rule-form"
                  >
                    <TextField
                      type="text"
                      name="rulePattern"
                      placeholder="Pattern"
                      size="small"
                      variant="standard"
                      required
                    />
                    <TextField
                      type="number"
                      name="rulePriority"
                      placeholder="Priority"
                      size="small"
                      variant="standard"
                      className="rule-priority-input"
                      slotProps={{
                        htmlInput: { min: 1, max: 5 },
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddIcon />}
                      loading={savingNewRule}
                    >
                      Add Rule
                    </Button>
                  </form>
                  {/* Placeholder for rules content */}
                  {loadingRules[category.cat_id] ? (
                    <Loading style={{ height: '100px' }} />
                  ) : (
                    <RulesList
                      rules={category.rules ?? []}
                      categoryId={category.cat_id}
                      setCategories={setCategories}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <li className="rule-item">No categories found.</li>
      )}
    </CategoryListStyles>
  );
};

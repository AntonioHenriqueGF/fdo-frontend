import React, { useCallback, useState } from 'react';
import type { CategoryList } from '../models/Categories';
import type { Rule, RuleList } from '../models/Rules';
import { Button, IconButton, TextField } from '@mui/material';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import { useSnackbar } from 'notistack';
import type { AxiosError } from 'axios';
import RuleIcon from '@mui/icons-material/Rule';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

interface RulesListProps {
  rules: RuleList[];
  categoryId: number;
  setCategories: React.Dispatch<React.SetStateAction<CategoryList[]>>;
}

export const RulesList: React.FC<RulesListProps> = ({ rules, categoryId, setCategories }) => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [deletingRuleId, setDeletingRuleId] = useState<Record<number, boolean>>({});
  const [savingEditRuleId, setSavingEditRuleId] = useState<Record<number, boolean>>({});

  const toggleEditRuleMode = useCallback((ruleId: number) => {
    setCategories((prev) => prev.map((cat) => ({
      ...cat,
      rules: cat.rules?.map((rule) => rule.rul_id === ruleId ? { ...rule, isEditing: !rule.isEditing } : rule),
    })));
  }, [setCategories]);

  const handleOnSubmitEditRule = useCallback((e: React.SubmitEvent<HTMLFormElement>, categoryId: number, ruleId: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rulePattern = formData.get('rulePattern') as string;
    const rulePriority = parseInt(formData.get('rulePriority') as string);
    // Send request to update the rule
    setSavingEditRuleId((prev) => ({ ...prev, [ruleId]: true }));
    ApiRequest<StandardApiResponse<Rule>>({
      url: `/api/categories/${categoryId}/rules/${ruleId}`,
      method: 'PUT',
      data: { pattern: rulePattern, priority: rulePriority },
      callback: (response) => {
        setCategories((prev) => prev.map((cat) => ({
          ...cat,
          rules: cat.rules?.map((rule) => rule.rul_id === ruleId ? response.data.data : rule),
        })));
      },
      errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
        const errorMessage = error.response?.data.data ?? 'Error updating rule';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      },
      finallyCallback: () => {
        setSavingEditRuleId((prev) => ({ ...prev, [ruleId]: false }));
      },
    });
  }, [enqueueSnackbar, setCategories]);

  const handleDeleteRule = useCallback((categoryId: number, ruleId: number) => {
    // Send request to delete the rule
    setDeletingRuleId((prev) => ({ ...prev, [ruleId]: true }));
    return ApiRequest({
      url: `/api/categories/${categoryId}/rules/${ruleId}`,
      method: 'DELETE',
      callback: () => {
        setCategories((prev) => prev.map((cat) => cat.cat_id === categoryId ? { ...cat, rules: cat.rules?.filter((rule) => rule.rul_id !== ruleId) } : cat));
      },
      errorCallback: (error: AxiosError<StandardApiResponse<string>>) => {
        const errorMessage = error.response?.data.data ?? 'Error deleting rule';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      },
      finallyCallback: () => {
        setDeletingRuleId((prev) => ({ ...prev, [ruleId]: false }));
      },
    });
  }, [enqueueSnackbar, setCategories]);
  return (<ul className="rules-list">
    {rules?.length ? rules.map((rule) => {
      const isEditingRule = rule.isEditing ?? false;
      const deleting = deletingRuleId[rule.rul_id] ?? false;
      const savingEdit = savingEditRuleId[rule.rul_id] ?? false;
      return (
        <React.Fragment key={rule.rul_id}>
          <li className="rule-item">
            <div className="rule-description item-description">
              <RuleIcon />
              {isEditingRule ? (
                <form onSubmit={(e) => handleOnSubmitEditRule(e, categoryId, rule.rul_id)} className="edit-rule-form">
                  <TextField type="text" name="rulePattern" defaultValue={rule.rul_pattern} placeholder="Pattern" size="small" variant="standard" required />
                  <TextField type="number" name="rulePriority" defaultValue={rule.rul_priority} placeholder="Priority" size="small" variant="standard" className="rule-priority-input" required />
                  <Button type="submit" variant="outlined" color="primary" size='small' startIcon={<SaveIcon />} loading={savingEdit}>Save</Button>
                </form>
              ) : (
                <>
                  {rule.rul_pattern} <span>(Priority: {rule.rul_priority})</span>
                </>
              )}
            </div>
            <div className="rule-item-buttons item-buttons">
              <IconButton color='warning' size='small' onClick={() => toggleEditRuleMode(rule.rul_id)}>{isEditingRule ? <CloseIcon /> : <EditIcon />}</IconButton>
              <IconButton color='error' size='small' onClick={() => handleDeleteRule(categoryId, rule.rul_id)} loading={deleting}><DeleteIcon /></IconButton>
            </div>
          </li>
        </React.Fragment>
      );}) : (
      <li className="rule-item">No rules found for this category.</li>
    )}
  </ul>);
};
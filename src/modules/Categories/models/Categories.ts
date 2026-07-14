import type { RuleList } from './Rules';


export interface Category {
  cat_id: number;
  cat_description: string;
  cat_is_income?: boolean;
}

export interface CategoryList extends Category {
  isEditing?: boolean;
  showRules?: boolean;
  rules?: RuleList[];
}
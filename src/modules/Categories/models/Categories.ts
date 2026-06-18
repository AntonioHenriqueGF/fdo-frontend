import type { RuleList } from './Rules';


export interface Category {
  cat_id: number;
  cat_description: string;
}

export interface CategoryList {
  cat_id: number;
  cat_description: string;
  isEditing?: boolean;
  showRules?: boolean;
  rules?: RuleList[];
}
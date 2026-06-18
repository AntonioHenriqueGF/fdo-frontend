export interface Rule {
  rul_id: number;
  rul_pattern: string;
  rul_priority: number;
}

export interface RuleList {
  rul_id: number;
  rul_pattern: string;
  rul_priority: number;
  isEditing?: boolean;
}
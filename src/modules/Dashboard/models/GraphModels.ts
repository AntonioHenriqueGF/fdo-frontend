export type GraphGranularity = 'monthly' | 'daily';

export type PeriodPreset = '1M' | '3M' | '6M' | '1Y' | '2Y' | 'ALL';

export interface MonthlyBalance {
  month: string;
  closing_balance: string;
}

export interface MonthlyTransaction {
  month: string;
  total_amount: string;
}

// Daily dates come as "yyyy-MM-dd 00:00:00"
export interface DailyBalance {
  dba_date: string;
  dba_closing_balance: string;
}

export interface DailyTransaction {
  tra_date: string;
  total_amount: string;
}

export interface DashboardFilters {
  granularity: GraphGranularity;
  // null when the user typed a custom date range
  preset: PeriodPreset | null;
  category_id: string[];
  // yyyy-MM-dd, empty string means unbounded
  date_start: string;
  date_end: string;
}

// period is yyyy-MM for monthly data and yyyy-MM-dd for daily data
export interface BalancePoint {
  period: string;
  closingBalance: number | null;
  movement: number;
}

export interface CategoryTotalGraphPoint {
  categoryId: string;
  label: string;
  totalAmount: number;
}

export interface CategoryPeriodGraphPoint {
  period: string;
  categoryId: string;
  label: string;
  totalAmount: number;
}

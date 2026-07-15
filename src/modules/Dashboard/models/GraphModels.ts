export interface DailyBalance {
  dba_date: string
  dba_closing_balance: string
}

export interface MonthlyBalance {
  month: string
  closing_balance: string
}

export interface DailyTransaction {
  tra_date: string
  total_amount: string
}

export interface MonthlyTransaction {
  month: string
  total_amount: string
}

export interface ReconciliationDailyData {
  tra_date: string
  total_amount: string
  dba_closing_balance: string
}

export interface DashboardCategoryFilters {
  category_id: string[]
  date_start: string
  date_end: string
}

export interface CategoryTotalGraphPoint {
  categoryId: string
  label: string
  totalAmount: number
}

export interface CategoryDailyGraphPoint {
  date: string
  categoryId: string
  label: string
  totalAmount: number
}
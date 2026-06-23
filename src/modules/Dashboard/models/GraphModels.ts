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
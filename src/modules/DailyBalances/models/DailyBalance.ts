export interface DailyBalanceResponse {
  total: number
  rows: DailyBalance[]
}

export interface DailyBalance {
  dba_id: number
  dba_date: string
  dba_closing_balance: string
}
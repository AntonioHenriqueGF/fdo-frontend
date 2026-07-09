export interface TransactionResponse {
  total: number
  rows: Transaction[]
}

export interface Transaction {
  tra_id: number
  tra_user_id: number
  tra_import_id: number
  tra_date: string
  tra_amount: string
  tra_description: string
  tra_matched_rule_id: number
  tra_category_id: number
  cat_description: string
}
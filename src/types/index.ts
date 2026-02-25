// User Types
export interface User {
  id: number;               // was string
  email: string;
  first_name: string;
  last_name: string;
  currency: string;
  created_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  currency?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Account Types
export type AccountType = 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'other';

export interface Account {
  id: number;               // was string
  user_id: number;          // was string
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountCreateInput {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  description?: string;
}

// Category Types
export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;               // was string
  user_id: number | null;   // was string | null
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export interface CategoryCreateInput {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

// Transaction Types
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;               // was string
  user_id: number;          // was string
  account_id: number;       // was string
  category_id: number | null; // was string | null
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  account_name?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface TransactionCreateInput {
  account_id: number;       // was string
  category_id?: number;     // was string
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  notes?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: number;       // was string
  categoryId?: number;      // was string
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

// Budget Types
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: number;               // was string
  user_id: number;          // was string
  category_id: number;      // was string
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string | null;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
  spent?: number;
  remaining?: number;
  percentage_used?: number;
}

export interface BudgetCreateInput {
  category_id: number;      // was string
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date?: string;
  alert_threshold?: number;
}

// Dashboard Types
export interface DashboardStats {
  total_balance: number;
  total_income: number;
  total_expense: number;
  net_savings: number;
  monthly_change: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySummary {
  category_id: number;      // was string
  category_name: string;
  category_color: string;
  total: number;
  percentage: number;
}

export interface RecentTransaction extends Transaction {
  account_name: string;
  category_name: string;
  category_color: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
export interface SeedUser {
  id: string;
  email: string;
  password: string;
}

export interface SeedAccount {
  id: string;
  accountName: string;
  type: 'Debit' | 'Credit' | 'Savings' | 'Cash';
  bank?: string;
  accountNumber?: string;
  clabe?: string; // Will be mapped to CLABE in schema
  balance: number;
  userId: string;
}

export interface SeedBudget {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
}

export interface SeedCategory {
  id: string;
  name: string;
  budgetId: string;
}

export interface SeedExpense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  notes?: string;
  categoryId: string;
  budgetId: string;
  accountId?: string;
}

export interface SeedTransfer {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  sourceAccountId: string;
  destinationAccountId: string;
  userId: string;
}

export interface SeedData {
  users: SeedUser[];
  accounts: SeedAccount[];
  budgets: SeedBudget[];
  categories: SeedCategory[];
  expenses: SeedExpense[];
  transfers: SeedTransfer[];
}
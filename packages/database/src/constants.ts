export const AccountType = {
  DEBIT: 'Debit',
  CREDIT: 'Credit',
  SAVINGS: 'Savings',
  CASH: 'Cash',
} as const;

export const BudgetCollaboratorRole = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  MANAGER: 'manager',
  OWNER: 'owner',
} as const;

export const Currency = {
  USD: 'USD',
  MXN: 'MXN',
  EUR: 'EUR',
} as const;

export const ExpenseStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];
export type BudgetCollaboratorRole = typeof BudgetCollaboratorRole[keyof typeof BudgetCollaboratorRole];
export type Currency = typeof Currency[keyof typeof Currency];
export type ExpenseStatus = typeof ExpenseStatus[keyof typeof ExpenseStatus];
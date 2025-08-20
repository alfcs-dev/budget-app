import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpdateUser,
  UpdateAccount,
  UpdateExpense,
} from '@budget-manager/database';
import {
  userApi,
  accountApi,
  expenseApi,
  healthApi,
  getApiErrorMessage,
} from '../lib/api-client';

// Query Keys
export const queryKeys = {
  health: ['health'] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  accounts: ['accounts'] as const,
  accountsByUser: (userId: string) => ['accounts', 'user', userId] as const,
  account: (id: string) => ['accounts', id] as const,
  accountBalance: (id: string) => ['accounts', id, 'balance'] as const,
  expenses: ['expenses'] as const,
  expensesByParams: (params: Record<string, any>) => ['expenses', params] as const,
  expense: (id: string) => ['expenses', id] as const,
  categoryExpenses: (categoryId: string, period?: string) =>
    ['expenses', 'category', categoryId, period] as const,
  budgetUtilization: (budgetId: string, limit: number, period?: string) =>
    ['expenses', 'budget', budgetId, 'utilization', limit, period] as const,
  expensesByDateRange: (startDate: Date, endDate: Date, userId?: string) =>
    ['expenses', 'dateRange', startDate.toISOString(), endDate.toISOString(), userId] as const,
};

// Health Hooks
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: healthApi.check,
    refetchInterval: 30000, // Check every 30 seconds
  });
};

// User Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: userApi.getAll,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.error('Failed to create user:', getApiErrorMessage(error));
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) => userApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
    },
    onError: (error) => {
      console.error('Failed to update user:', getApiErrorMessage(error));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.error('Failed to delete user:', getApiErrorMessage(error));
    },
  });
};

// Account Hooks
export const useAccounts = (userId?: string) => {
  return useQuery({
    queryKey: userId ? queryKeys.accountsByUser(userId) : queryKeys.accounts,
    queryFn: () => accountApi.getAll(userId),
  });
};

export const useAccountsByUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.accountsByUser(userId),
    queryFn: () => accountApi.getByUser(userId),
    enabled: !!userId,
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => accountApi.getById(id),
    enabled: !!id,
  });
};

export const useAccountBalance = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accountBalance(id),
    queryFn: () => accountApi.getBalance(id),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.create,
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsByUser(newAccount.userId) });
    },
    onError: (error) => {
      console.error('Failed to create account:', getApiErrorMessage(error));
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccount }) => accountApi.update(id, data),
    onSuccess: (updatedAccount, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.account(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsByUser(updatedAccount.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountBalance(id) });
    },
    onError: (error) => {
      console.error('Failed to update account:', getApiErrorMessage(error));
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
    onError: (error) => {
      console.error('Failed to delete account:', getApiErrorMessage(error));
    },
  });
};

// Expense Hooks
export const useExpenses = (params?: {
  userId?: string;
  budgetId?: string;
  categoryId?: string;
  period?: 'week' | 'month' | 'year';
}) => {
  return useQuery({
    queryKey: queryKeys.expensesByParams(params || {}),
    queryFn: () => expenseApi.getAll(params),
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: () => expenseApi.getById(id),
    enabled: !!id,
  });
};

export const useCategoryExpenses = (categoryId: string, period?: 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: queryKeys.categoryExpenses(categoryId, period),
    queryFn: () => expenseApi.getCategoryExpenses(categoryId, period),
    enabled: !!categoryId,
  });
};

export const useBudgetUtilization = (
  budgetId: string,
  limit: number,
  period?: 'week' | 'month' | 'year'
) => {
  return useQuery({
    queryKey: queryKeys.budgetUtilization(budgetId, limit, period),
    queryFn: () => expenseApi.getBudgetUtilization(budgetId, limit, period),
    enabled: !!budgetId && limit > 0,
  });
};

export const useExpensesByDateRange = (startDate: Date, endDate: Date, userId?: string) => {
  return useQuery({
    queryKey: queryKeys.expensesByDateRange(startDate, endDate, userId),
    queryFn: () => expenseApi.getByDateRange(startDate, endDate, userId),
    enabled: !!startDate && !!endDate,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.create,
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categoryExpenses(newExpense.categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.expensesByParams({ budgetId: newExpense.budgetId }),
      });
      if (newExpense.accountId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.accountBalance(newExpense.accountId),
        });
      }
    },
    onError: (error) => {
      console.error('Failed to create expense:', getApiErrorMessage(error));
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpense }) => expenseApi.update(id, data),
    onSuccess: (updatedExpense, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categoryExpenses(updatedExpense.categoryId),
      });
      if (updatedExpense.accountId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.accountBalance(updatedExpense.accountId),
        });
      }
    },
    onError: (error) => {
      console.error('Failed to update expense:', getApiErrorMessage(error));
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
    },
    onError: (error) => {
      console.error('Failed to delete expense:', getApiErrorMessage(error));
    },
  });
};
import axios, { AxiosResponse } from 'axios';
import {
  User,
  Account,
  Expense,
  CreateUser,
  UpdateUser,
  CreateAccount,
  UpdateAccount,
  CreateExpense,
  UpdateExpense,
  CreateUserSchema,
  UpdateUserSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
  CreateExpenseSchema,
  UpdateExpenseSchema,
} from '@budget-manager/database';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response Types
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  calculated: number;
}

export interface CategoryExpenses {
  categoryId: string;
  categoryName: string;
  period: string;
  expenses: Expense[];
  total: number;
  totalFormatted: string;
}

export interface BudgetUtilization {
  budgetId: string;
  budgetName: string;
  period: string;
  limit: number;
  limitFormatted: string;
  used: number;
  remaining: number;
  percentage: number;
  usedFormatted: string;
  remainingFormatted: string;
}

export interface DateRangeExpenses {
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
  total: number;
  totalFormatted: string;
  count: number;
}

// User API
export const userApi = {
  create: async (userData: CreateUser): Promise<Omit<User, 'password'>> => {
    // Validate on client side before sending
    const validatedData = CreateUserSchema.parse(userData);
    const response: AxiosResponse<Omit<User, 'password'>> = await apiClient.post('/users', validatedData);
    return response.data;
  },

  getAll: async (): Promise<Omit<User, 'password'>[]> => {
    const response: AxiosResponse<Omit<User, 'password'>[]> = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<Omit<User, 'password'>> => {
    const response: AxiosResponse<Omit<User, 'password'>> = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, updateData: UpdateUser): Promise<Omit<User, 'password'>> => {
    // Validate on client side before sending
    const validatedData = UpdateUserSchema.parse(updateData);
    const response: AxiosResponse<Omit<User, 'password'>> = await apiClient.patch(`/users/${id}`, validatedData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// Account API
export const accountApi = {
  create: async (accountData: CreateAccount): Promise<Account> => {
    // Validate on client side before sending
    const validatedData = CreateAccountSchema.parse(accountData);
    const response: AxiosResponse<Account> = await apiClient.post('/accounts', validatedData);
    return response.data;
  },

  getAll: async (userId?: string): Promise<Account[]> => {
    const params = userId ? { userId } : {};
    const response: AxiosResponse<Account[]> = await apiClient.get('/accounts', { params });
    return response.data;
  },

  getByUser: async (userId: string): Promise<Account[]> => {
    const response: AxiosResponse<Account[]> = await apiClient.get(`/accounts/user/${userId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response: AxiosResponse<Account> = await apiClient.get(`/accounts/${id}`);
    return response.data;
  },

  getBalance: async (id: string): Promise<AccountBalance> => {
    const response: AxiosResponse<AccountBalance> = await apiClient.get(`/accounts/${id}/balance`);
    return response.data;
  },

  update: async (id: string, updateData: UpdateAccount): Promise<Account> => {
    // Validate on client side before sending
    const validatedData = UpdateAccountSchema.parse(updateData);
    const response: AxiosResponse<Account> = await apiClient.patch(`/accounts/${id}`, validatedData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.delete(`/accounts/${id}`);
    return response.data;
  },
};

// Expense API
export const expenseApi = {
  create: async (expenseData: CreateExpense): Promise<Expense> => {
    // Validate on client side before sending
    const validatedData = CreateExpenseSchema.parse(expenseData);
    const response: AxiosResponse<Expense> = await apiClient.post('/expenses', validatedData);
    return response.data;
  },

  getAll: async (params?: {
    userId?: string;
    budgetId?: string;
    categoryId?: string;
    period?: 'week' | 'month' | 'year';
  }): Promise<Expense[]> => {
    const response: AxiosResponse<Expense[]> = await apiClient.get('/expenses', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Expense> => {
    const response: AxiosResponse<Expense> = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  getCategoryExpenses: async (
    categoryId: string,
    period?: 'week' | 'month' | 'year'
  ): Promise<CategoryExpenses> => {
    const params = period ? { period } : {};
    const response: AxiosResponse<CategoryExpenses> = await apiClient.get(
      `/expenses/category/${categoryId}`,
      { params }
    );
    return response.data;
  },

  getBudgetUtilization: async (
    budgetId: string,
    limit: number,
    period?: 'week' | 'month' | 'year'
  ): Promise<BudgetUtilization> => {
    const params = { limit: limit.toString(), ...(period && { period }) };
    const response: AxiosResponse<BudgetUtilization> = await apiClient.get(
      `/expenses/budget/${budgetId}/utilization`,
      { params }
    );
    return response.data;
  },

  getByDateRange: async (
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<DateRangeExpenses> => {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(userId && { userId }),
    };
    const response: AxiosResponse<DateRangeExpenses> = await apiClient.get('/expenses/date-range', {
      params,
    });
    return response.data;
  },

  update: async (id: string, updateData: UpdateExpense): Promise<Expense> => {
    // Validate on client side before sending
    const validatedData = UpdateExpenseSchema.parse(updateData);
    const response: AxiosResponse<Expense> = await apiClient.patch(`/expenses/${id}`, validatedData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};

// Health Check API
export const healthApi = {
  check: async (): Promise<{ status: string; database: string; timestamp: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Error handling helper
export const isApiError = (error: Error | unknown): error is { response: { data: ApiError } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getApiErrorMessage = (error: Error | unknown): string => {
  if (isApiError(error)) {
    const apiError = error.response.data;
    if (apiError.errors && apiError.errors.length > 0) {
      return apiError.errors.map(err => `${err.field}: ${err.message}`).join(', ');
    }
    return apiError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;
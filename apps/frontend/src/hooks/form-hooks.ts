import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateUserSchema,
  UpdateUserSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
  CreateExpenseSchema,
  UpdateExpenseSchema,
  CreateUser,
  UpdateUser,
  CreateAccount,
  UpdateAccount,
  CreateExpense,
  UpdateExpense,
  AccountType,
} from '@budget-manager/database';

// Form hook types
export type UserFormData = CreateUser;
export type UserUpdateFormData = UpdateUser;
export type AccountFormData = CreateAccount;
export type AccountUpdateFormData = UpdateAccount;
export type ExpenseFormData = CreateExpense;
export type ExpenseUpdateFormData = UpdateExpense;

// User Form Hooks
export const useUserForm = (
  defaultValues?: Partial<UserFormData>
): UseFormReturn<UserFormData> => {
  return useForm<UserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      password: '',
      ...defaultValues,
    },
  });
};

export const useUserUpdateForm = (
  defaultValues?: Partial<UserUpdateFormData>
): UseFormReturn<UserUpdateFormData> => {
  return useForm<UserUpdateFormData>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
};

// Account Form Hooks
export const useAccountForm = (
  defaultValues?: Partial<AccountFormData>
): UseFormReturn<AccountFormData> => {
  return useForm<AccountFormData>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      accountName: '',
      type: AccountType.DEBIT,
      balance: 0,
      userId: '',
      ...defaultValues,
    },
  });
};

export const useAccountUpdateForm = (
  defaultValues?: Partial<AccountUpdateFormData>
): UseFormReturn<AccountUpdateFormData> => {
  return useForm<AccountUpdateFormData>({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
};

// Expense Form Hooks
export const useExpenseForm = (
  defaultValues?: Partial<ExpenseFormData>
): UseFormReturn<ExpenseFormData> => {
  return useForm<ExpenseFormData>({
    resolver: zodResolver(CreateExpenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date(),
      categoryId: '',
      budgetId: '',
      ...defaultValues,
    },
  });
};

export const useExpenseUpdateForm = (
  defaultValues?: Partial<ExpenseUpdateFormData>
): UseFormReturn<ExpenseUpdateFormData> => {
  return useForm<ExpenseUpdateFormData>({
    resolver: zodResolver(UpdateExpenseSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
};

// Form validation helpers
export const getFormErrorMessage = (errors: Record<string, Error>, fieldName: string): string | undefined => {
  const error = errors[fieldName];
  return error?.message;
};

export const hasFormError = (errors: Record<string, Error>, fieldName: string): boolean => {
  return !!errors[fieldName];
};

// Field validation states for UI
export const getFieldValidationState = (
  fieldName: string,
  errors: Record<string, Error>,
  isDirty: boolean,
  isSubmitted: boolean
): 'default' | 'error' | 'success' => {
  if (hasFormError(errors, fieldName)) {
    return 'error';
  }
  
  if (isDirty || isSubmitted) {
    return 'success';
  }
  
  return 'default';
};
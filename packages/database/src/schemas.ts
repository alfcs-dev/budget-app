import { z } from "zod";
import {
  AccountType,
  BudgetCollaboratorRole,
  // Currency,
  // ExpenseStatus,
} from "./constants";

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

// Account schemas
export const CreateAccountSchema = z.object({
  accountName: z.string().min(1),
  type: z.enum([
    AccountType.DEBIT,
    AccountType.CREDIT,
    AccountType.SAVINGS,
    AccountType.CASH,
  ]),
  bank: z.string().optional(),
  accountNumber: z.string().optional(),
  clabe: z.string().optional(),
  balance: z.number().default(0),
  userId: z.string().uuid(),
});

export const UpdateAccountSchema = z.object({
  accountName: z.string().min(1).optional(),
  type: z
    .enum([
      AccountType.DEBIT,
      AccountType.CREDIT,
      AccountType.SAVINGS,
      AccountType.CASH,
    ])
    .optional(),
  bank: z.string().optional(),
  accountNumber: z.string().optional(),
  clabe: z.string().optional(),
  balance: z.number().optional(),
});

// Budget schemas
export const CreateBudgetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ownerId: z.string().uuid(),
});

export const UpdateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Category schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  budgetId: z.string().uuid(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
});

// Expense schemas
export const CreateExpenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  date: z.date(),
  notes: z.string().optional(),
  categoryId: z.string().uuid(),
  budgetId: z.string().uuid(),
  accountId: z.string().uuid().optional(),
});

export const UpdateExpenseSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.date().optional(),
  notes: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
});

// Transfer schemas
export const CreateTransferSchema = z.object({
  amount: z.number().positive(),
  date: z.date(),
  description: z.string().optional(),
  sourceAccountId: z.string().uuid(),
  destinationAccountId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

export const UpdateTransferSchema = z.object({
  amount: z.number().positive().optional(),
  date: z.date().optional(),
  description: z.string().optional(),
});

// Budget Collaborator schemas
export const CreateBudgetCollaboratorSchema = z.object({
  budgetId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum([
    BudgetCollaboratorRole.VIEWER,
    BudgetCollaboratorRole.EDITOR,
    BudgetCollaboratorRole.MANAGER,
  ]),
});

export const UpdateBudgetCollaboratorSchema = z.object({
  role: z.enum([
    BudgetCollaboratorRole.VIEWER,
    BudgetCollaboratorRole.EDITOR,
    BudgetCollaboratorRole.MANAGER,
  ]),
});

// Type exports
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;
export type CreateBudget = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
export type CreateExpense = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpense = z.infer<typeof UpdateExpenseSchema>;
export type CreateTransfer = z.infer<typeof CreateTransferSchema>;
export type UpdateTransfer = z.infer<typeof UpdateTransferSchema>;
export type CreateBudgetCollaborator = z.infer<
  typeof CreateBudgetCollaboratorSchema
>;
export type UpdateBudgetCollaborator = z.infer<
  typeof UpdateBudgetCollaboratorSchema
>;

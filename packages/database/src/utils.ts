import { PrismaClient } from "@prisma/client";

export type TransactionCallback<T> = (
  tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0],
) => Promise<T>;

// Database connection helper
export function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });
}

// Transaction helper
export async function withTransaction<T>(
  prisma: PrismaClient,
  callback: TransactionCallback<T>,
): Promise<T> {
  return prisma.$transaction(callback);
}

// Account balance helpers
export function calculateAccountBalance(
  transactions: Array<{ amount: number; type: "income" | "expense" }>,
) {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === "income"
      ? balance + transaction.amount
      : balance - transaction.amount;
  }, 0);
}

// Date helpers
export function getDateRange(
  period: "week" | "month" | "year",
  date: Date = new Date(),
) {
  const start = new Date(date);
  const end = new Date(date);

  switch (period) {
    case "week":
      start.setDate(date.getDate() - date.getDay());
      end.setDate(start.getDate() + 6);
      break;
    case "month":
      start.setDate(1);
      end.setMonth(date.getMonth() + 1, 0);
      break;
    case "year":
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      break;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// Expense calculation helpers
export function calculateCategoryTotal(expenses: Array<{ amount: number }>) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function calculateBudgetUtilization(
  expenses: Array<{ amount: number }>,
  budgetLimit: number,
) {
  const totalExpenses = calculateCategoryTotal(expenses);
  return {
    used: totalExpenses,
    remaining: Math.max(0, budgetLimit - totalExpenses),
    percentage: budgetLimit > 0 ? (totalExpenses / budgetLimit) * 100 : 0,
  };
}

// Validation helpers
export function validateUniqueAccountName(
  accountName: string,
  userId: string,
  existingAccounts: Array<{ accountName: string; userId: string }>,
) {
  return !existingAccounts.some(
    (account) =>
      account.accountName === accountName && account.userId === userId,
  );
}

export function validateUniqueCategoryName(
  categoryName: string,
  budgetId: string,
  existingCategories: Array<{ name: string; budgetId: string }>,
) {
  return !existingCategories.some(
    (category) =>
      category.name === categoryName && category.budgetId === budgetId,
  );
}

// Currency helpers
export function formatCurrency(amount: number, currency: string = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatCurrencyMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

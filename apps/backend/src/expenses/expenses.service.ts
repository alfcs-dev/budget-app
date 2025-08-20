import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateExpenseSchema,
  UpdateExpenseSchema,
  CreateExpense,
  UpdateExpense,
  Expense,
  calculateCategoryTotal,
  calculateBudgetUtilization,
  getDateRange,
  formatCurrencyMXN,
} from '@budget-manager/database';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(expenseData: CreateExpense): Promise<Expense> {
    // Validate input using shared schema
    const validatedData = CreateExpenseSchema.parse(expenseData);

    return this.prisma.expense.create({
      data: validatedData,
      include: {
        category: true,
        budget: true,
        account: true,
      },
    });
  }

  async findAll(
    userId?: string,
    budgetId?: string,
    categoryId?: string,
    period?: 'week' | 'month' | 'year'
  ): Promise<Expense[]> {
    let where: any = {};

    if (budgetId) {
      where.budgetId = budgetId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by user through budget ownership
    if (userId) {
      where.budget = { ownerId: userId };
    }

    // Filter by date period using shared utility
    if (period) {
      const { start, end } = getDateRange(period);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    return this.prisma.expense.findMany({
      where,
      include: {
        category: true,
        budget: true,
        account: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        budget: true,
        account: true,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(id: string, updateData: UpdateExpense): Promise<Expense> {
    // Validate input using shared schema
    const validatedData = UpdateExpenseSchema.parse(updateData);

    return this.prisma.expense.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
        budget: true,
        account: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.expense.delete({
      where: { id },
    });
  }

  // Business logic methods using shared utilities
  async getCategoryExpenses(categoryId: string, period?: 'week' | 'month' | 'year') {
    let where: any = { categoryId };

    // Filter by date period using shared utility
    if (period) {
      const { start, end } = getDateRange(period);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      include: { category: true },
    });

    // Calculate total using shared utility
    const total = calculateCategoryTotal(expenses);

    return {
      categoryId,
      categoryName: expenses[0]?.category?.name || 'Unknown',
      period: period || 'all',
      expenses,
      total,
      totalFormatted: formatCurrencyMXN(total),
    };
  }

  async getBudgetUtilization(budgetId: string, budgetLimit: number, period?: 'week' | 'month' | 'year') {
    let where: any = { budgetId };

    // Filter by date period using shared utility
    if (period) {
      const { start, end } = getDateRange(period);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      include: { budget: true },
    });

    // Calculate utilization using shared utility
    const utilization = calculateBudgetUtilization(expenses, budgetLimit);

    return {
      budgetId,
      budgetName: expenses[0]?.budget?.name || 'Unknown',
      period: period || 'all',
      limit: budgetLimit,
      limitFormatted: formatCurrencyMXN(budgetLimit),
      ...utilization,
      usedFormatted: formatCurrencyMXN(utilization.used),
      remainingFormatted: formatCurrencyMXN(utilization.remaining),
    };
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date, userId?: string) {
    let where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) {
      where.budget = { ownerId: userId };
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      include: {
        category: true,
        budget: true,
        account: true,
      },
      orderBy: { date: 'desc' },
    });

    const total = calculateCategoryTotal(expenses);

    return {
      startDate,
      endDate,
      expenses,
      total,
      totalFormatted: formatCurrencyMXN(total),
      count: expenses.length,
    };
  }
}
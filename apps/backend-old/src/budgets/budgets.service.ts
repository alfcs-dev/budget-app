import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    // Check if budget already exists for this category and period
    const existing = await this.prisma.budget.findUnique({
      where: {
        categoryId_userId_period: {
          categoryId: createBudgetDto.categoryId,
          userId,
          period: createBudgetDto.period,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Budget already exists for this category and period');
    }

    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        amount: new Decimal(createBudgetDto.amount),
        startDate: new Date(createBudgetDto.startDate),
        endDate: new Date(createBudgetDto.endDate),
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: [
        { period: 'asc' },
        { category: { name: 'asc' } },
      ],
    });
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string) {
    await this.findOne(id, userId); // Check if exists and belongs to user

    return this.prisma.budget.update({
      where: { id },
      data: {
        ...updateBudgetDto,
        amount: updateBudgetDto.amount ? new Decimal(updateBudgetDto.amount) : undefined,
        startDate: updateBudgetDto.startDate ? new Date(updateBudgetDto.startDate) : undefined,
        endDate: updateBudgetDto.endDate ? new Date(updateBudgetDto.endDate) : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check if exists and belongs to user
    
    return this.prisma.budget.delete({
      where: { id },
    });
  }

  // Get budget summary with actual vs planned
  async getBudgetSummary(userId: string, period: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        period: period as any,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        category: {
          include: {
            expenses: {
              where: {
                date: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
            },
          },
        },
      },
    });

    return budgets.map(budget => {
      const spent = budget.category.expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
      const budgetAmount = Number(budget.amount);
      
      return {
        id: budget.id,
        name: budget.name,
        category: budget.category.name,
        budgeted: budgetAmount,
        spent,
        remaining: budgetAmount - spent,
        percentUsed: (spent / budgetAmount) * 100,
        period: budget.period,
      };
    });
  }
}

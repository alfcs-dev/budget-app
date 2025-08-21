import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAccountSchema,
  UpdateAccountSchema,
  CreateAccount,
  UpdateAccount,
  Account,
  calculateAccountBalance,
  validateUniqueAccountName,
} from '@budget-manager/database';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(accountData: CreateAccount): Promise<Account> {
    // Validate input using shared schema
    const validatedData = CreateAccountSchema.parse(accountData);

    // Check for unique account name per user
    const existingAccounts = await this.prisma.account.findMany({
      where: { userId: validatedData.userId },
      select: { accountName: true, userId: true },
    });

    if (
      !validateUniqueAccountName(
        validatedData.accountName,
        validatedData.userId,
        existingAccounts,
      )
    ) {
      throw new BadRequestException(
        `Account name "${validatedData.accountName}" already exists for this user`,
      );
    }

    return this.prisma.account.create({
      data: validatedData,
    });
  }

  async findAll(userId?: string): Promise<Account[]> {
    const where = userId ? { userId } : {};
    return this.prisma.account.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true },
        },
        expenses: true,
        sourceTransfers: true,
        destTransfers: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async findByUser(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateData: UpdateAccount): Promise<Account> {
    // Validate input using shared schema
    const validatedData = UpdateAccountSchema.parse(updateData);

    // If updating account name, check uniqueness
    if (validatedData.accountName) {
      const account = await this.prisma.account.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      const existingAccounts = await this.prisma.account.findMany({
        where: { userId: account.userId, id: { not: id } },
        select: { accountName: true, userId: true },
      });

      if (
        !validateUniqueAccountName(
          validatedData.accountName,
          account.userId,
          existingAccounts,
        )
      ) {
        throw new BadRequestException(
          `Account name "${validatedData.accountName}" already exists for this user`,
        );
      }
    }

    return this.prisma.account.update({
      where: { id },
      data: validatedData,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.account.delete({
      where: { id },
    });
  }

  // Business logic methods using shared utilities
  async getAccountBalance(
    id: string,
  ): Promise<{ accountId: string; balance: number; calculated: number }> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        expenses: true,
        sourceTransfers: true,
        destTransfers: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Calculate balance using shared utility
    const transactions = [
      ...account.expenses.map((exp) => ({
        amount: exp.amount,
        type: 'expense' as const,
      })),
      ...account.sourceTransfers.map((transfer) => ({
        amount: transfer.amount,
        type: 'expense' as const,
      })),
      ...account.destTransfers.map((transfer) => ({
        amount: transfer.amount,
        type: 'income' as const,
      })),
    ];

    const calculatedBalance =
      account.balance + calculateAccountBalance(transactions);

    return {
      accountId: id,
      balance: account.balance,
      calculated: calculatedBalance,
    };
  }
}

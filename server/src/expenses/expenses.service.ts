import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma:PrismaService) {}

  getExpenses(id: string, limit?: number, offset?: number) {
    return this.prisma.expenses.findMany({
      where: { wallet: {userId: id} },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getExpense(id: string) {
    const expense = await this.prisma.expenses.findUnique({
      where: { id },
    });

    if (!expense) throw new NotFoundException()

    return expense
  }

  async createExpense(data: {
    title: string;
    amount: number;
    date: Date;
    categoryId?: string;
    walletId?: string;
  }) {
    // Create the expense record
    const expense = await this.prisma.expenses.create({
      data: {
        title: data.title,
        amount: data.amount,
        date: data.date,
        categoryId: data.categoryId,
        walletId: data.walletId,
      },
    });

    // Update wallet expenses balance if wallet is provided
    if (data.walletId) {
      await this.prisma.wallets.update({
        where: { id: data.walletId },
        data: {
          expensesBalance: {
            increment: data.amount
          }
        }
      });
    }

    return expense;
  }

  async updateExpense(id: string, data: {
    title?: string;
    amount?: number;
    date?: Date;
    categoryId?: string;
    walletId?: string;
  }, userId: string) {
    // Get the original expense to handle wallet balance updates
    const originalExpense = await this.prisma.expenses.findUnique({
      where: { id },
      select: { amount: true, walletId: true, wallet: { select: { userId: true } } }
    });

    if (!originalExpense)
      throw new NotFoundException();

    if (userId != originalExpense.wallet?.userId)
      throw new UnauthorizedException();

    // If amount is being updated and there's a wallet, adjust the wallet balance
    if (data.amount !== undefined && originalExpense.walletId) {
      const amountDifference = data.amount - originalExpense.amount;
      await this.prisma.wallets.update({
        where: { id: originalExpense.walletId },
        data: {
          expensesBalance: {
            increment: amountDifference
          }
        }
      });
    }

    // Update the expense record
    return this.prisma.expenses.update({
      where: { id },
      data
    });
  }

  async deleteExpense(id: string, userId: string) {
    // Get the expense to handle wallet balance update
    const expense = await this.prisma.expenses.findUnique({
      where: { id },
      select: { amount: true, walletId: true, wallet: { select: { userId: true } } }
    });

    if (!expense)
      throw new NotFoundException();

    if (userId !== expense?.wallet?.userId)
      throw new UnauthorizedException();

    // If expense has a wallet, decrease the wallet's expenses balance
    if (expense.walletId) {
      await this.prisma.wallets.update({
        where: { id: expense.walletId },
        data: {
          expensesBalance: {
            decrement: expense.amount
          }
        }
      });
    }

    // Delete the expense record
    return this.prisma.expenses.delete({
      where: { id }
    });
  }
}

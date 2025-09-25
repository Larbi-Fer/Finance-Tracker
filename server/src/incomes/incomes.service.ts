import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  getIncomes(id: string, limit?: number, offset?: number) {
    return this.prisma.incomes.findMany({
      where: { wallet: {userId: id} },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getIncome(id: string) {
    const income = await this.prisma.incomes.findUnique({
      where: { id }
    });

    if (!income) throw new NotFoundException()
    
    return income
  }

  async createIncome(data: {
    title?: string;
    amount: number;
    date: Date;
    sourceId: string;
    walletId: string;
  }) {
    // Create the income record
    const income = await this.prisma.incomes.create({
      data: {
        title: data.title,
        amount: data.amount,
        date: data.date,
        sourceId: data.sourceId,
        walletId: data.walletId,
      },
    });

    // Update wallet income balance
    await this.prisma.wallets.update({
      where: { id: data.walletId },
      data: {
        incomeBalance: {
          increment: data.amount
        }
      }
    });

    return income;
  }

  async updateIncome(id: string, data: {
    title?: string;
    amount?: number;
    date?: Date;
    sourceId?: string;
    walletId?: string;
  }, userId: string) {
    // Get the original income to handle wallet balance updates
    const originalIncome = await this.prisma.incomes.findUnique({
      where: { id },
      select: { amount: true, walletId: true, wallet: { select: { userId: true } } }
    });

    if (!originalIncome)
      throw new NotFoundException();

    if (userId !== originalIncome.wallet?.userId)
      throw new UnauthorizedException();

    // If amount is being updated, adjust the wallet balance
    if (data.amount !== undefined && originalIncome.walletId) {
      const amountDifference = data.amount - originalIncome.amount;
      await this.prisma.wallets.update({
        where: { id: originalIncome.walletId },
        data: {
          incomeBalance: {
            increment: amountDifference
          }
        }
      });
    }

    // Update the income record
    return this.prisma.incomes.update({
      where: { id },
      data
    });
  }

  async deleteIncome(id: string, userId: string) {
    // Get the income to handle wallet balance update
    const income = await this.prisma.incomes.findUnique({
      where: { id },
      select: { amount: true, walletId: true, wallet: { select: { userId: true } } }
    });

    if (!income)
      throw new NotFoundException();

    if (userId !== income.wallet?.userId)
      throw new UnauthorizedException();

    // Decrease the wallet's income balance
    await this.prisma.wallets.update({
      where: { id: income.walletId },
      data: {
        incomeBalance: {
          decrement: income.amount
        }
      }
    });

    // Delete the income record
    return this.prisma.incomes.delete({
      where: { id }
    });
  }
}

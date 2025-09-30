import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWalletDto, WalletDto } from './dto/wallets.dto';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getWallets(userId: string) {
    const wallets = await this.prisma.wallets.findMany({
      where: { userId },
      include: {
        currnecy: {
          select: { format: true }
        },
        expenses: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          select: {
            amount: true
          }
        },
        incomes: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          select: {
            amount: true
          }
        }
      }
    });

    return wallets.map(wallet => ({
      ...wallet,
      totalExpenses: wallet.expenses.reduce((acc, curr) => acc + curr.amount, 0),
      totalIncomes: wallet.incomes.reduce((acc, curr) => acc + curr.amount, 0),
      balance: wallet.incomeBalance +
        wallet.incomes.reduce((acc, curr) => acc + curr.amount, 0) -
        wallet.expensesBalance -
        wallet.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    }));
  }

  async getWallet(id: string, userId: string) {
    const wallet = await this.prisma.wallets.findUnique({
      where: { id },
      include: {
        currnecy: true,
        expenses: true,
        incomes: true
      }
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new UnauthorizedException('Unauthorized access to wallet');

    return wallet;
  }

  async createWallet(userId: string, data: WalletDto) {
    const wallet = await this.prisma.wallets.create({
      data: {
        ...data,
        userId
      },
      include: {
        currnecy: {
          select: { format: true }
        }
      }
    });

    return wallet;
  }

  async updateWallet(id: string, userId: string, data: UpdateWalletDto) {
    const wallet = await this.prisma.wallets.findUnique({
      where: { id }
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new UnauthorizedException('Unauthorized access to wallet');

    const updatedWallet = await this.prisma.wallets.update({
      where: { id },
      data,
      include: {
        currnecy: {
          select: { format: true }
        }
      }
    });

    return updatedWallet;
  }

  async deleteWallet(id: string, userId: string) {
    const wallet = await this.prisma.wallets.findUnique({
      where: { id }
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.userId !== userId) throw new UnauthorizedException('Unauthorized access to wallet');

    await this.prisma.wallets.delete({
      where: { id }
    });

    return { success: true };
  }
}

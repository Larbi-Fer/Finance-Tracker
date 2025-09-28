import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getMainData(id: string) {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: {
        walltes: {
          include: {
            currnecy: {
              omit: {id: true}
            },
            expenses: {
              orderBy: { date: 'desc' },
              take: 10,
              include: {
                category: {
                  omit: {userId: true}
                },    
              },
              omit: {
                categoryId: true, walletId: true
              }
            },
            incomes: {
              orderBy: { date: 'desc' },
              take: 10,
              include: {
                source: {
                  select: { id: true, title: true }
                }
              },
              omit: {
                sourceId: true, walletId: true
              }
            }
          }
        },
      },
    });

    if (!data) throw new NotFoundException('', {description: 'Invalide user id'})

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const incomes = await this.prisma.incomes.groupBy({
      by: ['walletId'],
      _sum: {amount: true},
      where: { wallet: {userId: id}, date: { gte: firstDayOfMonth } },
    })
    const expenses = await this.prisma.expenses.groupBy({
      by: ['walletId'],
      _sum: {amount: true},
      where: { wallet: {userId: id}, date: { gte: firstDayOfMonth } },
    })    

    const totalBalance = data.walltes.reduce((acc, wallet) => acc + wallet.incomeBalance - wallet.expensesBalance, 0);
    const MonthBalance = {
      totalIncomes: incomes.reduce((acc, i) => acc + i._sum.amount!, 0),
      totalExpenses: expenses.reduce((acc, i) => acc + i._sum.amount!, 0)
    }
    
    return {wallets: data.walltes.map(wallet =>
      ({
        ...wallet,
        monthIncomes: incomes.find(income => income.walletId == wallet.id)?._sum?.amount || 0,
        monthExpenses: expenses.find(expense => expense.walletId == wallet.id)?._sum?.amount || 0,
      })),
      balance: {
        total: totalBalance,
        ...MonthBalance
      }
    }
  }
}

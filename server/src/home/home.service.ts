import { Injectable } from '@nestjs/common';
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
                  omit: {userId: true, amount: true}
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

    if (!data) return {message: 'WRONG_ID'}

    const totalBalance = data.walltes.reduce((acc, wallet) => acc + wallet.incomeBalance - wallet.expensesBalance, 0);

    return {...data, totalBalance};
  }
}

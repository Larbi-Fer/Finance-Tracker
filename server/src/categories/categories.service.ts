import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async getCategories(userId: string) {
    // Fetch categories
    const categories = await this.prisma.categories.findMany({
      where: { userId },
      omit: {userId: true},
      include: {
        _count: {
          select: { expenses: true }
        },
        budget: {
          select: {
            amount: true,
            currencyId: true,
            currency: { select: { format: true, id: true } }
          }
        }
      }
    });

    // Get first day of this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Group expenses by category and wallet
    const groupedExpenses = await this.prisma.expenses.groupBy({
      by: ['categoryId', 'walletId'],
      _sum: { amount: true },
      where: {
        wallet: { userId },
        date: { gte: firstDayOfMonth }
      }
    });

    // Fetch wallets to get currency per wallet
    const wallets = await this.prisma.wallets.findMany({
      where: { userId },
      select: {
        id: true,
        currnecy: {
          select: { id: true, format: true }
        }
      }
    });

    // Map walletId -> currency
    const walletCurrencyMap = Object.fromEntries(
      wallets.map(w => [w.id, w.currnecy])
    );

    // Sum expenses per category + currency
    const expenseSums = new Map<string, number>();

    for (const g of groupedExpenses) {
      const currency = walletCurrencyMap[g.walletId!];
      if (!currency) continue;

      const key = `${g.categoryId}-${currency.id}`;
      const prev = expenseSums.get(key) || 0;
      expenseSums.set(key, prev + (g._sum.amount || 0));
    }

    // Get all distinct user currencies (in case some budgets are missing)
    const userCurrencies = Object.values(
      Object.fromEntries(wallets.map(w => [w.currnecy.id, w.currnecy]))
    );

    // Final return with spent added to each budget
    return categories.map(category => {
      // Ensure all user currencies are present in budget
      const completeBudget = userCurrencies.map(currency => {
        const existing = category.budget.find(b => b.currency.id === currency.id);
        const spent = expenseSums.get(`${category.id}-${currency.id}`) || 0;

        return {
          amount: existing?.amount || 0,
          currency: { format: currency.format },
          currencyId: currency.id,
          spent
        };
      });

      return {
        ...category,
        budget: completeBudget
      };
    });
  }


  async getCategory(id: string, userId: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        expenses: {
          include: {
            wallet: {
              select: {
                name: true,
                currnecy: true
              }
            }
          }
        },
        _count: {
          select: { expenses: true }
        },
      }
    });

    if (!category)
      throw new NotFoundException('Category not found');

    if (category.userId !== userId)
      throw new UnauthorizedException();

    const monthly = await this.getMonthlyCategoryExpenses(id, userId, 2026);

    return { ...category, monthly };
  }

  async getMonthlyCategoryExpenses(
    categoryId: string,
    userId: string,
    year: number,
  ) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);

    const expenses = await this.prisma.expenses.findMany({
      where: {
        categoryId,
        category: {
          userId,
        },
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        amount: true,
        date: true,
      },
    });

    // Group in JS by month
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
    }));

    for (const expense of expenses) {
      const month = expense.date.getUTCMonth(); // 0–11
      monthlyTotals[month].total += expense.amount;
    }

    return monthlyTotals;
  }

  createCategory(userId: string, data: {
    title: string;
    icon?: string;
    budget: {
      currencyId: string;
      amount: number
    }[]
  }) {
    return this.prisma.categories.create({
      data: {
        title: data.title,
        icon: data.icon,
        budget: {
          createMany: {
            data: data.budget.filter(b => b.amount != 0)
          }
        },
        userId
      }
    });
  }

  async updateCategory(id: string, userId: string, data: {
    title?: string;
    amount?: number;
  }) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!category)
      throw new NotFoundException('Category not found');

    if (category.userId !== userId)
      throw new UnauthorizedException();

    return this.prisma.categories.update({
      where: { id },
      data
    });
  }

  async deleteCategory(id: string, userId: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!category)
      throw new NotFoundException('Category not found');

    if (category.userId !== userId)
      throw new UnauthorizedException();

    // Delete the category
    return this.prisma.categories.delete({
      where: { id }
    });
  }
}

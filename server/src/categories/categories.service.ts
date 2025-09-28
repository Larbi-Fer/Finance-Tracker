import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories(userId: string) {
    const categ = await this.prisma.categories.findMany({
      where: { userId },
      omit: {userId: true},
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sum = await this.prisma.expenses.groupBy({
      by: ['categoryId'],
      _sum: {amount: true},
      where: { wallet: {userId}, date: { gte: firstDayOfMonth } },
    })

    return categ.map(c => ({...c, month: sum.find(s => s.categoryId == c.id)?._sum?.amount || 0}));
  }

  async getCategory(id: string, userId: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        expenses: true,
        _count: {
          select: { expenses: true }
        }
      }
    });

    if (!category)
      throw new NotFoundException('Category not found');

    if (category.userId !== userId)
      throw new UnauthorizedException();

    return category;
  }

  createCategory(userId: string, data: {
    title: string;
    amount: number;
  }) {
    return this.prisma.categories.create({
      data: {
        ...data,
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

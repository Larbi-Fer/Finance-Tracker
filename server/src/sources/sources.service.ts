import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SourcesService {
  constructor(private prisma: PrismaService) {}

  async getSources(userId: string) {
    const sources = await this.prisma.incomeSources.findMany({
      where: { userId },
      omit: {userId: true},
      include: {
        _count: {
          select: { incomes: true }
        }
      },
    });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sum = await this.prisma.incomes.groupBy({
      by: ['sourceId'],
      _sum: {amount: true},
      where: { wallet: {userId}, date: { gte: firstDayOfMonth } },
    })

    return sources.map(source => ({...source, month: sum.find(s => s.sourceId == source.id)?._sum?.amount || 0}));
  }

  async getSource(id: string, userId: string) {
    const source = await this.prisma.incomeSources.findUnique({
      where: { id },
      include: {
        incomes: true,
        _count: {
          select: { incomes: true }
        }
      }
    });

    if (!source)
      throw new NotFoundException('Income source not found');

    if (source.userId !== userId)
      throw new UnauthorizedException();

    return source;
  }

  createSource(userId: string, data: { title: string }) {
    return this.prisma.incomeSources.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async updateSource(id: string, userId: string, data: { title?: string }) {
    const source = await this.prisma.incomeSources.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!source)
      throw new NotFoundException('Income source not found');

    if (source.userId !== userId)
      throw new UnauthorizedException();

    return this.prisma.incomeSources.update({
      where: { id },
      data
    });
  }

  async deleteSource(id: string, userId: string) {
    const source = await this.prisma.incomeSources.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!source)
      throw new NotFoundException('Income source not found');

    if (source.userId !== userId)
      throw new UnauthorizedException();

    return this.prisma.incomeSources.delete({
      where: { id }
    });
  }
}

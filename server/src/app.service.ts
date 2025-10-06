import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getCurrencies() {
    return this.prisma.currencies.findMany()
  }

  getUserCurrencies(userId: string) {
    return this.prisma.currencies.findMany({
      where: {
        wallets: {some: {userId}}
      }
    })
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';
import { HomeModule } from './home/home.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { SourcesModule } from './sources/sources.module';

@Module({
  imports: [AuthModule, PrismaModule, HomeModule, ExpensesModule, IncomesModule, CategoriesModule, SourcesModule],
  controllers: [AppController, HomeController],
  providers: [AppService, PrismaService, HomeService, CategoriesService],
})
export class AppModule {}

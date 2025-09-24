import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';
import { HomeModule } from './home/home.module';

@Module({
  imports: [AuthModule, PrismaModule, HomeModule],
  controllers: [AppController, HomeController],
  providers: [AppService, PrismaService, HomeService],
})
export class AppModule {}

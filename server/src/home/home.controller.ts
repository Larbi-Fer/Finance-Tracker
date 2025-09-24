import { Controller, Get, Param } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get('main-data/:id')
  getMainData(@Param('id') id: string) {
    return this.homeService.getMainData(id);
  }
}

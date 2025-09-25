import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomeDto, UpdateIncomeDto } from './dto/incomes.dto';

@Controller(':id/incomes')
export class IncomesController {
  constructor(private incomesService: IncomesService) {}

  @Get()
  getIncomes(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.incomesService.getIncomes(id, limit ? parseInt(limit) : undefined, offset ? parseInt(offset) : undefined);
  }

  @Get(':incomeId')
  getIncome(@Param('incomeId') id: string) {
    return this.incomesService.getIncome(id)
  }

  @Post('')
  createIncome(@Param('id') id: string, @Body() body: IncomeDto) {
    console.log(body);
    
    return this.incomesService.createIncome({
      title: body.title,
      amount: body.amount,
      date: new Date(body.date),
      sourceId: body.sourceId,
      walletId: body.walletId,
    });
  }
  
  @Patch(':incomeId')
  updateIncome(@Param('incomeId') incomeId: string, @Param('id') userId: string, @Body() data: UpdateIncomeDto) {
    return this.incomesService.updateIncome(incomeId, {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    }, userId);
  }

  @Delete(':incomeId')
  deleteIncome(@Param('incomeId') incomeId: string, @Param('id') userId: string) {
    return this.incomesService.deleteIncome(incomeId, userId);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpenseDto } from './dto/expenses.dto';

@Controller(':id/expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getExpenses(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.expensesService.getExpenses(id, limit ? parseInt(limit) : undefined, offset ? parseInt(offset) : undefined);
  }

  @Get(':expenseId')
  getIncome(@Param('expenseId') id: string) {
    return this.expensesService.getExpense(id)
  }

  @Post('')
  createExpense(@Param('id') id: string, @Body() body: ExpenseDto) {
    return this.expensesService.createExpense({
      title: body.title,
      amount: body.amount,
      date: new Date(body.date),
      categoryId: body.categoryId,
      walletId: body.walletId,
    });
  }
  
  @Patch(':expenseId')
  updateExpense(@Param('expenseId') expenseId: string, @Param('id') userId: string, @Body() data: ExpenseDto) {
    return this.expensesService.updateExpense(expenseId, {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    }, userId);
  }

  @Delete(':expenseId')
  deleteExpense(@Param('expenseId') expenseId: string, @Param('id') userId: string) {
    return this.expensesService.deleteExpense(expenseId, userId);
  }
}
